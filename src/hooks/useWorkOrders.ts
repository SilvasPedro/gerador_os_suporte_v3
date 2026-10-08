import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  limit,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/config';
import { SavedWorkOrderRecord } from '../types/os';

const COLLECTION_NAME = 'workOrders';
const LOCAL_STORAGE_KEY = 'telecom_workorders_cache';

export function useWorkOrders() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const q = query(collection(db, COLLECTION_NAME), limit(50));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: SavedWorkOrderRecord[] = [];
        snapshot.forEach((d) => {
          const data = d.data();
          items.push({
            id: d.id,
            createdAt: data.createdAt || new Date().toISOString(),
            operatorName: data.operatorName || '',
            scheduleDate: data.scheduleDate || '',
            period: data.period || '',
            contactPhone: data.contactPhone || '',
            motive: data.motive || '',
            generatedMask: data.generatedMask || '',
          });
        });

        items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        queryClient.setQueryData(['workOrders'], items);
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items.slice(0, 30)));
        } catch {
          // ignore storage error
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
      }
    );

    return () => unsubscribe();
  }, [queryClient]);

  const { data: workOrders = [] } = useQuery<SavedWorkOrderRecord[]>({
    queryKey: ['workOrders'],
    queryFn: async () => {
      const cached = queryClient.getQueryData<SavedWorkOrderRecord[]>(['workOrders']);
      if (cached) return cached;
      try {
        const snap = await getDocs(query(collection(db, COLLECTION_NAME), limit(30)));
        const list: SavedWorkOrderRecord[] = [];
        snap.forEach((d) => {
          const val = d.data();
          list.push({
            id: d.id,
            createdAt: val.createdAt,
            operatorName: val.operatorName,
            scheduleDate: val.scheduleDate,
            period: val.period,
            contactPhone: val.contactPhone,
            motive: val.motive,
            generatedMask: val.generatedMask,
          });
        });
        return list;
      } catch {
        // Fallback to local storage if offline
        const local = localStorage.getItem(LOCAL_STORAGE_KEY);
        return local ? JSON.parse(local) : [];
      }
    },
    staleTime: 1000 * 60 * 2,
  });

  const saveOrderMutation = useMutation({
    mutationFn: async (order: Omit<SavedWorkOrderRecord, 'id' | 'createdAt'>) => {
      const newRef = doc(collection(db, COLLECTION_NAME));
      const record: SavedWorkOrderRecord = {
        ...order,
        id: newRef.id,
        createdAt: new Date().toISOString(),
      };
      try {
        await setDoc(newRef, record);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `${COLLECTION_NAME}/${newRef.id}`);
      }
      return record;
    },
    onSuccess: (newRecord) => {
      queryClient.setQueryData<SavedWorkOrderRecord[]>(['workOrders'], (old = []) => [
        newRecord,
        ...old,
      ]);
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `${COLLECTION_NAME}/${id}`);
      }
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData<SavedWorkOrderRecord[]>(['workOrders'], (old = []) =>
        old.filter((item) => item.id !== id)
      );
    },
  });

  return {
    workOrders,
    saveOrder: saveOrderMutation.mutateAsync,
    deleteOrder: deleteOrderMutation.mutateAsync,
    isSaving: saveOrderMutation.isPending,
  };
}
