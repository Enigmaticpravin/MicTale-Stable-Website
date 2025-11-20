'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/app/lib/firebase-db';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { 
  HelpCircle, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  Package, 
  Download, 
  CreditCard, 
  BookOpen, 
  Ticket,
  ChevronDown,
  Filter
} from 'lucide-react';
import Footer from '@/app/components/Footer';

export default function MyOrders() {
  const [tickets, setTickets] = useState([]);
  const [bookOrders, setBookOrders] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // all, tickets, books
  const [filterStatus, setFilterStatus] = useState('all');
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser?.uid) return;
      
      try {
        // Fetch tickets
        const ticketsQuery = query(
          collection(db, 'tickets'),
          where('userId', '==', currentUser?.uid),
        );
        const ticketSnapshot = await getDocs(ticketsQuery);
        const ticketList = ticketSnapshot.docs.map(doc => ({
          id: doc.id,
          type: 'ticket',
          ...doc.data()
        }));
        
        // Fetch book orders
        const ordersQuery = query(
          collection(db, 'orders'),
          where('email', '==', currentUser.email),
        );
        const orderSnapshot = await getDocs(ordersQuery);
        const orderList = orderSnapshot.docs.map(doc => ({
          id: doc.id,
          type: 'book',
          ...doc.data()
        }));
        
        setTickets(ticketList);
        setBookOrders(orderList);
        
        // Fetch show details for tickets
        const showIds = [...new Set(ticketList.map(ticket => ticket.showId))];
        await fetchShowDetails(showIds);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [currentUser?.uid, currentUser?.email]);

  const sendToPaymentGateway = async (order) => {
    const isTicket = order.type === 'ticket';
    const orderId = isTicket ? order.bookingId : order.orderId;
    const amount = isTicket ? 200 : (order.book.price * order.quantity + 50);
    const productInfo = isTicket ? "Poetry Event Ticket" : `Book Order: ${order.book.title}`;
    
    const response = await fetch('/api/payments/payu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: amount,
        productInfo: productInfo,
        firstname: isTicket ? order.fullName : order.name,
        email: order.email,
        phone: isTicket ? order.phoneNumber : order.phone,
        [isTicket ? 'bookingId' : 'orderId']: orderId,
      }),
    });
    
    const data = await response.json();
    if (data.action) {
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = data.action;

      Object.keys(data).forEach((key) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = data[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    }
  };
  
  const fetchShowDetails = async (showIds) => {
    try {
      const showData = {};
      for (const showId of showIds) {
        const showQuery = query(
          collection(db, 'shows'),
          where('showid', '==', showId)
        );
        const showSnapshot = await getDocs(showQuery);
        if (!showSnapshot.empty) {
          showData[showId] = showSnapshot.docs[0].data();
        }
      }
      setShowDetails(showData);
    } catch (error) {
      console.error('Error fetching show details:', error);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };
  
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'confirmed':
      case 'delivered':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'pending':
      case 'processing':
        return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'cancelled':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'shipped':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };
  
  const formatDate = (date) => {
    if (!date) return 'Date TBD';
    const eventDate = date.toDate ? date.toDate() : new Date(date);
    return eventDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date) => {
    if (!date) return 'Time TBD';
    const eventDate = date.toDate ? date.toDate() : new Date(date);
    return eventDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const allOrders = [...tickets, ...bookOrders].sort((a, b) => {
    const dateA = a.createdAt || a.timestamp;
    const dateB = b.createdAt || b.timestamp;
    const timeA = dateA?.toDate ? dateA.toDate() : new Date(dateA);
    const timeB = dateB?.toDate ? dateB.toDate() : new Date(dateB);
    return timeB - timeA;
  });

  const poppinsStyle = { fontFamily: 'Poppins, sans-serif' };

  const getFilteredOrders = () => {
    let filtered = allOrders;
    
    if (activeTab === 'tickets') {
      filtered = filtered.filter(order => order.type === 'ticket');
    } else if (activeTab === 'books') {
      filtered = filtered.filter(order => order.type === 'book');
    }
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(order => {
        const status = order.paymentStatus || order.status;
        return status?.toLowerCase() === filterStatus;
      });
    }
    
    return filtered;
  };

  const filteredOrders = getFilteredOrders();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-gray-400">
          <div className="w-5 h-5 border-2 border-gray-600 border-t-gray-400 rounded-full animate-spin"></div>
          <span>Loading orders...</span>
        </div>
      </div>
    );
  }

  return (
    <>
     <div className="min-h-screen md:rounded-2xl md:mr-2 md:ml-2 md:mb-2 bg-gray-950 text-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 sm:py-8">
        
        <div className="mb-8 flex flex-col w-full justify-center text-center">
        <p
      className='uppercase text-transparent bg-clip-text bg-gradient-to-t font-bold text-[12px] md:text-[18px] from-yellow-700 via-yellow-500 to-yellow-900'
      style={poppinsStyle}
    >
      Manage Your Orders
    </p>
    <p
      className='text-transparent bg-clip-text bg-gradient-to-t font-semibold text-2xl md:text-4xl text-center from-slate-200 via-gray-400 to-white veronica-class'
    >
      For Shows and Books{' '}
    </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-400">Total</p>
                <p className="text-lg sm:text-xl font-semibold text-white">{allOrders.length}</p>
              </div>
              <Package className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-400">Tickets</p>
                <p className="text-lg sm:text-xl font-semibold text-white">{tickets.length}</p>
              </div>
              <Ticket className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-400">Books</p>
                <p className="text-lg sm:text-xl font-semibold text-white">{bookOrders.length}</p>
              </div>
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-400">Pending</p>
                <p className="text-lg sm:text-xl font-semibold text-white">
                  {allOrders.filter(o => (o.paymentStatus || o.status)?.toLowerCase() === 'pending').length}
                </p>
              </div>
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Category Filter */}
          <div className="flex bg-gray-900 border border-gray-800 rounded-lg p-1 overflow-hidden">
            {[
              { key: 'all', label: 'All', count: allOrders.length },
              { key: 'tickets', label: 'Tickets', count: tickets.length },
              { key: 'books', label: 'Books', count: bookOrders.length }
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === key 
                    ? 'bg-white text-gray-900' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{label.charAt(0)}</span>
                <span className="ml-1 text-xs">({count})</span>
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex bg-gray-900 border border-gray-800 rounded-lg p-1">
            {[
              { key: 'all', label: 'All Status' },
              { key: 'confirmed', label: 'Confirmed' },
              { key: 'pending', label: 'Pending' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilterStatus(key)}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  filterStatus === key 
                    ? 'bg-gray-800 text-white' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
            <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Package className="w-6 h-6 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No orders found</h3>
            <p className="text-gray-400 text-sm">
              {activeTab === 'all' 
                ? "You haven't placed any orders yet."
                : `No ${activeTab} found with the selected filters.`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredOrders.map((order) => {
                const isTicket = order.type === 'ticket';
                const show = isTicket ? showDetails[order.showId] || {} : null;
                const status = order.paymentStatus || order.status || 'pending';
                const isExpanded = expandedId === order.id;
                
                return (
                  <motion.div
                    key={order.id}
                    layout
                    className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-gray-700 transition-colors"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Order Header */}
                    <div 
                      onClick={() => toggleExpand(order.id)}
                      className="p-4 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                          {/* Order Icon/Image */}
                          <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                            {isTicket ? (
                              show.imageUrl ? (
                                <img src={show.imageUrl} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <Ticket className="w-5 h-5 text-gray-400" />
                              )
                            ) : (
                              order.book?.coverUrl ? (
                                <img src={order.book.coverUrl} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <BookOpen className="w-5 h-5 text-gray-400" />
                              )
                            )}
                          </div>
                          
                          {/* Order Info */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-medium text-white truncate text-sm sm:text-base">
                                {isTicket ? (show.name || 'Poetry Event') : order.book?.title || 'Book Order'}
                              </h3>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                isTicket ? 'bg-blue-400/10 text-blue-400' : 'bg-green-400/10 text-green-400'
                              }`}>
                                {isTicket ? 'Ticket' : 'Book'}
                              </span>
                            </div>
                            <div className="flex items-center space-x-3 text-xs sm:text-sm text-gray-400">
                              <span className="truncate">
                                {isTicket ? order.bookingId : order.orderId}
                              </span>
                              <span className="hidden sm:inline">
                                {formatDate(order.createdAt || order.timestamp)}
                              </span>
                              {((isTicket && order.attendeeCount) || (!isTicket && order.quantity)) && (
                                <span>
                                  {isTicket ? `${order.attendeeCount} attendee${order.attendeeCount > 1 ? 's' : ''}` : `Qty: ${order.quantity}`}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Status & Expand */}
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <span className={`inline-flex items-center px-2 py-1 rounded border text-xs font-medium ${getStatusColor(status)}`}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                          <motion.div 
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="p-1"
                          >
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          </motion.div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="border-t border-gray-800 overflow-hidden"
                        >
                          <div className="p-4 space-y-4">
                            {/* Order Image/Preview - Mobile Friendly */}
                            <div className="relative h-32 sm:h-40 rounded-lg overflow-hidden bg-gray-800">
                              {isTicket && show.imageUrl ? (
                                <>
                                  <img src={show.imageUrl} alt={show.name} className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                  <div className="absolute bottom-2 left-2 right-2">
                                    <h4 className="font-medium text-white text-sm mb-1 truncate">{show.name}</h4>
                                    <div className="flex items-center space-x-3 text-xs text-gray-200">
                                      {show.location && (
                                        <div className="flex items-center space-x-1">
                                          <MapPin className="w-3 h-3" />
                                          <span className="truncate">{show.location}</span>
                                        </div>
                                      )}
                                      {show.date && (
                                        <div className="flex items-center space-x-1">
                                          <Calendar className="w-3 h-3" />
                                          <span>{formatDate(show.date)}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </>
                              ) : !isTicket && order.book?.coverUrl ? (
                                <div className="flex items-center justify-center h-full">
                                  <img src={order.book.coverUrl} alt={order.book.title} className="h-24 sm:h-32 max-w-20 sm:max-w-24 object-cover rounded shadow-lg" />
                                </div>
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  {isTicket ? (
                                    <Ticket className="w-8 h-8 text-gray-500" />
                                  ) : (
                                    <BookOpen className="w-8 h-8 text-gray-500" />
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Order Details */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                              <div>
                                <h5 className="text-gray-400 text-xs uppercase tracking-wide mb-2">Customer Details</h5>
                                <div className="space-y-1">
                                  <div className="flex items-center space-x-2">
                                    <User className="w-3 h-3 text-gray-500" />
                                    <span className="text-gray-300">{isTicket ? order.fullName : order.name}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Mail className="w-3 h-3 text-gray-500" />
                                    <span className="text-gray-300 truncate">{order.email}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Phone className="w-3 h-3 text-gray-500" />
                                    <span className="text-gray-300">{isTicket ? order.phoneNumber : order.phone}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <h5 className="text-gray-400 text-xs uppercase tracking-wide mb-2">Order Info</h5>
                                <div className="space-y-1">
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Order ID:</span>
                                    <span className="text-gray-300 font-mono text-xs">{isTicket ? order.bookingId : order.orderId}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Date:</span>
                                    <span className="text-gray-300">{formatDate(order.createdAt || order.timestamp)}</span>
                                  </div>
                                  {isTicket && order.attendeeCount && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-400">Attendees:</span>
                                      <span className="text-gray-300">{order.attendeeCount}</span>
                                    </div>
                                  )}
                                  {!isTicket && order.quantity && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-400">Quantity:</span>
                                      <span className="text-gray-300">{order.quantity}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-2 border-t border-gray-800">
                              <div className="flex flex-col sm:flex-row gap-2">
                                {status === 'pending' ? (
                                  <button
                                    onClick={() => sendToPaymentGateway(order)}
                                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 text-sm"
                                  >
                                    <CreditCard className="w-4 h-4" />
                                    <span>Complete Payment</span>
                                  </button>
                                ) : status === 'confirmed' ? (
                                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 text-sm">
                                    <Download className="w-4 h-4" />
                                    <span>{isTicket ? 'Download Ticket' : 'Download Invoice'}</span>
                                  </button>
                                ) : (
                                  <div className="flex-1 bg-red-600/20 border border-red-600/30 text-red-400 py-2 px-4 rounded-lg font-medium text-center text-sm">
                                    Order {status.charAt(0).toUpperCase() + status.slice(1)}
                                  </div>
                                )}
                                
                                <button className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 text-sm">
                                  <HelpCircle className="w-4 h-4" />
                                  <span>Help</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
    <Footer />
    </>
   
  );
}