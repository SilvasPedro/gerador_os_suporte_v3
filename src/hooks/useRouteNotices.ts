import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  getDocs,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/config';
import { RouteNotice } from '../types/os';

const COLLECTION_NAME = 'routeNotices';

const INITIAL_SEED_NOTICES: Omit<RouteNotice, 'id'>[] = [
  {
    title: 'Manutenção Preventiva - Rota Anel Óptico Norte',
    route: 'Rota Norte / POP Central',
    status: 'active',
    description: 'Equipe de campo em alinhamento de fusão. Oscilações pontuais podem ocorrer até às 17h.',
    author: 'NOC / Coordenação',
    createdAt: new Date().toISOString(),
  },
  {
    title: 'CTO 08 a 15 - Bairro Jardim das Flores',
    route: 'Regional Sul - Jardim das Flores',
    status: 'investigating',
    description: 'Verificação de atenuação elevada nas portas 3 e 4. Técnico Anderson em deslocamento.',
    author: 'Supervisão de Campo',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

export function useRouteNotices() {
  const queryClient = useQueryClient();

  // Real-time snapshot synchronizer feeding React Query cache
  useEffect(() => {
    const colRef = collection(db, COLLECTION_NAME);

    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const notices: RouteNotice[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          notices.push({
            id: docSnap.id,
            title: data.title || '',
            route: data.route || '',
            status: data.status || 'active',
            description: data.description || '',
            author: data.author || 'Operador',
            createdAt: data.createdAt || new Date().toISOString(),
          });
        });

        // Sort latest first
        notices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        // Update React Query cache immediately
        queryClient.setQueryData(['routeNotices'], notices);

        // Only seed initially on the very first visit if user has not explicitly cleared them
        const hasBeenSeeded = localStorage.getItem('route_notices_has_been_seeded');
        const userCleared = localStorage.getItem('route_notices_user_cleared');

        if (snapshot.empty && !hasBeenSeeded && !userCleared) {
          localStorage.setItem('route_notices_has_been_seeded', 'true');
          seedInitialData();
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
      }
    );

    return () => unsubscribe();
  }, [queryClient]);

  const seedInitialData = async () => {
    try {
      const snap = await getDocs(collection(db, COLLECTION_NAME));
      if (snap.empty) {
        for (const notice of INITIAL_SEED_NOTICES) {
          const newDocRef = doc(collection(db, COLLECTION_NAME));
          await setDoc(newDocRef, notice);
        }
      }
    } catch (err) {
      console.warn('Could not seed initial notices:', err);
    }
  };

  // React Query hook
  const { data: notices = [], isLoading, isError } = useQuery<RouteNotice[]>({
    queryKey: ['routeNotices'],
    queryFn: async () => {
      // Return currently cached data or fetch initial
      const cached = queryClient.getQueryData<RouteNotice[]>(['routeNotices']);
      if (cached) return cached;
      try {
        const snap = await getDocs(collection(db, COLLECTION_NAME));
        const list: RouteNotice[] = [];
        snap.forEach((d) => {
          const val = d.data();
          list.push({
            id: d.id,
            title: val.title,
            route: val.route,
            status: val.status,
            description: val.description,
            author: val.author,
            createdAt: val.createdAt,
          });
        });
        return list;
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, COLLECTION_NAME);
        return [];
      }
    },
    staleTime: 1000 * 60, // 1 minute
  });

  // Mutations
  const addNoticeMutation = useMutation({
    mutationFn: async (notice: Omit<RouteNotice, 'id'>) => {
      const newRef = doc(collection(db, COLLECTION_NAME));
      try {
        await setDoc(newRef, {
          ...notice,
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `${COLLECTION_NAME}/${newRef.id}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routeNotices'] });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'active' | 'investigating' | 'resolved' }) => {
      try {
        await updateDoc(doc(db, COLLECTION_NAME, id), { status });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `${COLLECTION_NAME}/${id}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routeNotices'] });
    },
  });

  const deleteNoticeMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
        localStorage.setItem('route_notices_user_cleared', 'true');
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `${COLLECTION_NAME}/${id}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routeNotices'] });
    },
  });

  const clearAllNoticesMutation = useMutation({
    mutationFn: async () => {
      try {
        localStorage.setItem('route_notices_user_cleared', 'true');
        const snap = await getDocs(collection(db, COLLECTION_NAME));
        const deletePromises = snap.docs.map((d) => deleteDoc(d.ref));
        await Promise.all(deletePromises);
        queryClient.setQueryData(['routeNotices'], []);
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, COLLECTION_NAME);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routeNotices'] });
    },
  });

  const restoreDefaultsMutation = useMutation({
    mutationFn: async () => {
      try {
        localStorage.removeItem('route_notices_user_cleared');
        localStorage.setItem('route_notices_has_been_seeded', 'true');
        for (const notice of INITIAL_SEED_NOTICES) {
          const newDocRef = doc(collection(db, COLLECTION_NAME));
          await setDoc(newDocRef, notice);
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, COLLECTION_NAME);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routeNotices'] });
    },
  });

  return {
    notices,
    isLoading,
    isError,
    addNotice: addNoticeMutation.mutateAsync,
    updateStatus: updateStatusMutation.mutateAsync,
    deleteNotice: deleteNoticeMutation.mutateAsync,
    clearAllNotices: clearAllNoticesMutation.mutateAsync,
    restoreDefaultNotices: restoreDefaultsMutation.mutateAsync,
    isAdding: addNoticeMutation.isPending,
    isClearingAll: clearAllNoticesMutation.isPending,
  };
}
