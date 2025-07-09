import { db } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc,
  query,
  where
} from 'firebase/firestore';

export const createTicket = async (ticketData) => {
  try {
    const docRef = await addDoc(collection(db, 'tickets'), ticketData);
    return { id: docRef.id, ...ticketData };
  } catch (error) {
    throw error;
  }
};

export const getTickets = async (userId, isAdmin = false) => {
  try {
    let q;
    if (isAdmin) {
      q = query(collection(db, 'tickets'));
    } else {
      q = query(collection(db, 'tickets'), where('userId', '==', userId));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw error;
  }
};

export const getTicketById = async (ticketId) => {
  try {
    const docRef = doc(db, 'tickets', ticketId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Ticket not found');
    }
  } catch (error) {
    throw error;
  }
};

export const updateTicket = async (ticketId, ticketData) => {
  try {
    const ticketRef = doc(db, 'tickets', ticketId);
    await updateDoc(ticketRef, ticketData);
    return { id: ticketId, ...ticketData };
  } catch (error) {
    throw error;
  }
};