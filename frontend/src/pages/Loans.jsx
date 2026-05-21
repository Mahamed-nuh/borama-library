import React, { useEffect, useState } from 'react';
import {
  CheckIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import Sidebar from '../components/Sidebar';
import AddLoanModal from '../components/AddLoanModal';
import { loanAPI, bookAPI, userAPI } from '../services/api';

const Loans = () => {
  const [loans, setLoans] = useState([]);
  const [books, setBooksMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) setUser(storedUser);

      const loansRes = await loanAPI.list();
      setLoans(loansRes.data.loans || []);

      const booksRes = await bookAPI.getAllBooks({ limit: 100 });
      const bookMap = {};
      (booksRes.data.books || []).forEach((book) => {
        bookMap[book._id] = book;
      });
      setBooksMap(bookMap);
    } catch (err) {
      setError('Failed to load loans');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBook = async (loanId) => {
    try {
      setActionLoading(loanId);
      await loanAPI.returnBook(loanId);
      loadData();
    } catch (err) {
      setError('Failed to return book');
    } finally {
      setActionLoading(null);
    }
  };

  const handleExtendLoan = async (loanId) => {
    try {
      setActionLoading(`${loanId}-extend`);
      await loanAPI.extendLoan(loanId);
      loadData();
    } catch (err) {
      setError('Failed to extend loan');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (loan) => {
    if (loan.returnDate) {
      return (
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          <CheckIcon className="h-3.5 w-3.5" />
          Returned
        </div>
      );
    }

    const today = new Date();
    const dueDate = new Date(loan.dueDate);
    const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

    if (daysUntilDue < 0) {
      return (
        <div className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
          <ExclamationTriangleIcon className="h-3.5 w-3.5" />
          Overdue
        </div>
      );
    }

    if (daysUntilDue <= 3) {
      return (
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
          <ClockIcon className="h-3.5 w-3.5" />
          Due Soon ({daysUntilDue}d)
        </div>
      );
    }

    return (
      <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
        <CheckIcon className="h-3.5 w-3.5" />
        Active
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="inline-flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-emerald-200" />
          <p className="text-sm text-slate-600">Loading loans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar userName={user?.name} />

      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Loans</h1>
              <p className="mt-1 text-sm text-slate-500">Manage book loans and track borrowed items across all members</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
            >
              <PlusIcon className="h-5 w-5" />
              Add Loan
            </button>
          </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {loans.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-slate-200 px-6 py-12 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <ClockIcon className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="mt-4 font-semibold text-slate-900">No Loans Yet</h3>
          <p className="mt-1 text-slate-600">Create your first loan by clicking the "Add Loan" button above.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.1em] text-slate-700">
                    Book Title
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.1em] text-slate-700">
                    Member
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.1em] text-slate-700">
                    Borrowed
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.1em] text-slate-700">
                    Due Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.1em] text-slate-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.1em] text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loans.map((loan) => {
                  const book = books[loan.bookId];
                  const isReturned = !!loan.returnDate;

                  return (
                    <tr
                      key={loan.loanId}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900">
                          {loan.bookTitle || 'Book Not Found'}
                        </p>
                        <p className="text-sm text-slate-500">{book?.author || 'N/A'}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        {loan.borrowerName || 'Member Not Found'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(loan.borrowDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {isReturned && loan.returnDate ? (
                          <>
                            Returned:{' '}
                            {new Date(loan.returnDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </>
                        ) : (
                          new Date(loan.dueDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(loan)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {!isReturned && (
                            <>
                              <button
                                onClick={() =>
                                  handleReturnBook(loan.loanId)
                                }
                                disabled={
                                  actionLoading ===
                                  loan.loanId
                                }
                                className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <CheckIcon className="h-3.5 w-3.5" />
                                Returned
                              </button>
                              <button
                                onClick={() =>
                                  handleExtendLoan(loan.loanId)
                                }
                                disabled={
                                  actionLoading ===
                                  `${loan.loanId}-extend`
                                }
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <ArrowPathIcon className="h-3.5 w-3.5" />
                                Extend
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAddModal && (
        <AddLoanModal
          onClose={() => setShowAddModal(false)}
          onLoanAdded={() => {
            setShowAddModal(false);
            loadData();
          }}
        />
      )}
        </div>
      </main>
    </div>
  );
};

export default Loans;
