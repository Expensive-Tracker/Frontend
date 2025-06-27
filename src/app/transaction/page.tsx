/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  SortingState,
  ColumnDef,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { FaEdit, FaPlus, FaWallet } from "react-icons/fa";
import { IoTrashBinSharp } from "react-icons/io5";
import { formatDate } from "@/util/services/date";
import Badge from "@/components/common/badge/badge";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Transaction } from "@/util/interface/api";
import Button from "@/components/common/button/button";
import InputAndLabel from "@/components/common/input/inputAndLabel";
import { useDebounce } from "@uidotdev/usehooks";
import { TfiAngleDown } from "react-icons/tfi";
import { handleGetTransaction } from "@/util/api/apis/transaction";
import Modal, { categories } from "@/components/common/modal/modal";
import { handleOpenAndCloseModal, handleRefetch } from "@/store/slice/uiSlice";
import Text from "@/components/common/text/text";
import {
  handleSetRemainFalse,
  handleSetRemainTrue,
} from "@/store/slice/userSlice";

const TransactionTable = () => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const userId = useSelector((state: RootState) => state.user.userDetail._id);
  const isOpen = useSelector((state: RootState) => state.uiSlice.modal.isOpen);
  const refetch = useSelector((state: RootState) => state.uiSlice.refetch);
  const transactionExits = useSelector(
    (state: RootState) => state.user.isNew.remain.transaction
  );

  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<Transaction[]>([]);
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [modalDetail, setModalDetail] = useState<{
    modalId: string;
    transactionId: string;
  }>({
    modalId: "add",
    transactionId: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const debounceSearch = useDebounce(search, 300);
  const [filter, setFilter] = useState({
    date: {
      startDate: "",
      endDate: "",
    },
    type: "",
    category: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 1,
    totalPages: 1,
  });
  const dispatch = useDispatch();
  const textPrimary = theme === "dark" ? "text-white" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-gray-300" : "text-gray-600";

  useEffect(() => {
    if (refetch) dispatch(handleRefetch());

    setLoading(true);
    const delayDebounce = setTimeout(() => {
      fetchTransactionList();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [
    pagination.limit,
    pagination.page,
    debounceSearch,
    filter.date.endDate,
    filter.date.startDate,
    filter.category,
    filter.type,
    refetch,
  ]);

  function handleChangeFilter(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    id: "startDate" | "endDate" | "type" | "category"
  ) {
    const { value } = e.target;

    if (id === "startDate" || id === "endDate") {
      setFilter((prev) => ({
        ...prev,
        date: {
          ...prev.date,
          [id]: value,
        },
      }));
    } else {
      setFilter((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  }
  const fetchTransactionList = useCallback(async () => {
    // setLoading(false);
    try {
      const response = await handleGetTransaction(
        pagination.page,
        pagination.limit,
        debounceSearch,
        {
          _id: userId,
          filter: {
            date: {
              ...filter.date,
            },
            type: filter.type,
            category: filter.category,
          },
        }
      );
      if (response.result.data.transactions)
        dispatch(handleSetRemainFalse("transaction"));
      setData(response.result.data.transactions);
      setPagination((prev) => ({
        ...prev,
        ...response.result.data.pagination,
      }));
    } catch (err: any) {
      if (err.response?.status === 404) {
        dispatch(handleSetRemainTrue("transaction"));
      }
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, debounceSearch, filter, refetch]);

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = Number(e.target.value);
    setPagination((prev) => ({
      ...prev,
      limit: newLimit,
      page: 1,
    }));
  };

  const transactionColumns: ColumnDef<Transaction>[] = [
    {
      header: "Date",
      accessorKey: "date",
      enableSorting: true,
      cell: ({ getValue }) => {
        const date = getValue() as string;
        return (
          <span
            className={`${theme === "dark" ? "text-white" : "text-gray-900"}`}
          >
            {formatDate(date)}
          </span>
        );
      },
    },
    {
      header: "Amount",
      accessorKey: "amount",
      enableSorting: false,

      cell: ({ getValue }) => {
        const amount = getValue() as number;
        return (
          <span
            className={` ${theme === "dark" ? "text-white" : "text-gray-800"}`}
          >
            ₹ {amount.toFixed(2)}
          </span>
        );
      },
    },
    {
      header: "Category",
      accessorKey: "category",
      enableSorting: false,
      cell: ({ getValue }) => {
        return (
          <span
            className={`${theme === "dark" ? "text-white" : "text-gray-900"}`}
          >
            {getValue() as string}
          </span>
        );
      },
    },
    {
      header: "Description",
      accessorKey: "description",
      enableSorting: false,
      cell: ({ getValue }) => {
        const desc = getValue() as string;
        return (
          <span
            className={`line-clamp-2 ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            } `}
          >
            {desc || "—"}
          </span>
        );
      },
    },
    {
      header: "Type",
      accessorKey: "type",
      enableSorting: false,
      cell: ({ getValue }) => {
        const value = (getValue() as string).toLowerCase();
        return (
          <Badge color={value === "income" ? "success" : "error"}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </Badge>
        );
      },
    },
    {
      header: "Recurring",
      accessorKey: "recurring",
      enableSorting: false,
      cell: ({ getValue }) => {
        const isRecurring = getValue() as boolean;
        return (
          <span
            className={`text-sm text-center block ${
              theme === "dark" ? "text-white" : "text-gray-700"
            }`}
          >
            {isRecurring ? "Yes" : "No"}
          </span>
        );
      },
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                setModalDetail(() => ({
                  modalId: "edit",
                  transactionId: String(row.original._id),
                }));
                dispatch(handleOpenAndCloseModal());
              }}
              title="Edit"
              className={`p-2 border rounded-full transition-colors hover:text-blue-600 cursor-pointer ${
                theme === "dark"
                  ? "border-gray-600 text-gray-300 hover:border-blue-400"
                  : "border-gray-300 text-gray-600"
              }`}
            >
              <FaEdit />
            </button>
            <button
              onClick={() => {
                setModalDetail(() => ({
                  modalId: "delete",
                  transactionId: String(row.original._id),
                }));
                dispatch(handleOpenAndCloseModal());
              }}
              title="Delete"
              className={`p-2 border rounded-full transition-colors hover:text-red-600  cursor-pointer ${
                theme === "dark"
                  ? "border-gray-600 text-gray-300 hover:border-red-400"
                  : "border-gray-300 text-gray-600"
              }`}
            >
              <IoTrashBinSharp />
            </button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: data || [],
    columns: transactionColumns,
    state: {
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    manualPagination: true,
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: pagination.totalPages,
  });

  if (transactionExits) {
    return (
      <div
        className={`w-full flex items-center justify-center flex-col gap-4 p-8 rounded-xl  ${textPrimary} `}
      >
        <div
          className={`p-4 rounded-full ${
            theme === "dark" ? "bg-blue-500/20" : "bg-blue-100"
          }`}
        >
          <FaWallet
            className={`text-3xl ${
              theme === "dark" ? "text-blue-400" : "text-blue-600"
            }`}
          />
        </div>
        <div className="text-center">
          <h3 className={`text-lg font-semibold mb-2 ${textPrimary}`}>
            No Transaction Set
          </h3>
          <p className={` ${textSecondary}`}>
            Create your first Transaction to start tracking your expenses
          </p>
        </div>
        <Button
          className="flex items-center gap-2  rounded-lg font-medium transition-all duration-200"
          onClick={() => {
            setModalDetail((pre) => ({
              ...pre,
              modalId: "add",
              transactionId: "",
            }));
            dispatch(handleOpenAndCloseModal());
          }}
        >
          <FaPlus /> Add Transaction
        </Button>
        {isOpen && (
          <Modal
            id={modalDetail.modalId}
            transactionId={modalDetail.transactionId}
          />
        )}
      </div>
    );
  }
  return (
    <div
      className={`p-4 py-6 ${
        theme === "dark" ? "bg-[#1B1C21] text-white" : "bg-white text-black"
      }`}
    >
      <div className="flex md:flex-row flex-col md:gap-0 gap-4 items-center justify-between mb-4">
        <div className="md:flex items-center gap-4">
          <h2 className="text-xl font-semibold ">Transactions</h2>
          <Button
            className="md:flex hidden items-center gap-2"
            onClick={() => {
              setModalDetail((pre) => ({
                ...pre,
                modalId: "add",
                transactionId: "",
              }));
              dispatch(handleOpenAndCloseModal());
            }}
          >
            <FaPlus /> Add Transaction
          </Button>
        </div>
        <div className="md:grid flex w-full md:w-auto flex-col-reverse md:grid-cols-[100px_auto] ms:gap-4 gap-2 ">
          <div className="w-full flex  gap-2">
            {/* Filter Button */}
            <div className="flex-1  w-full sm:w-auto relative">
              <Button
                className="w-full flex justify-between items-center"
                onClick={() => setShowFilter((prev) => !prev)}
              >
                Filter{" "}
                <TfiAngleDown
                  className={`ml-2 transition-transform ${
                    showFilter ? "rotate-180" : "rotate-0"
                  }`}
                  size={14}
                />
              </Button>
              {showFilter && (
                <div
                  className={`absolute left-0 md:w-[240px] sm:w-full w-[200px] top-full mt-2 z-10 rounded-md shadow-md px-4 py-3 space-y-4 ${
                    theme === "dark"
                      ? "bg-[#1B1C21] text-white"
                      : "bg-white text-black"
                  }`}
                >
                  <div>
                    <label className="text-sm font-medium">By Date Range</label>
                    <input
                      type="date"
                      value={filter.date.startDate}
                      onChange={(e) => handleChangeFilter(e, "startDate")}
                      className="w-full mt-1 px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-transparent"
                    />
                    <input
                      type="date"
                      value={filter.date.endDate}
                      onChange={(e) => handleChangeFilter(e, "endDate")}
                      className="w-full mt-2 px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-transparent"
                    />
                  </div>

                  {/* Type */}
                  <div>
                    <label className="text-sm font-medium">By Type</label>
                    <select
                      value={filter.type}
                      onChange={(e) => handleChangeFilter(e, "type")}
                      className="w-full mt-1 px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-transparent"
                    >
                      <option value="">All</option>
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">By Category</label>
                    <select
                      value={filter.category}
                      onChange={(e) => handleChangeFilter(e, "category")}
                      className="w-full mt-1 px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-transparent"
                    >
                      <option value="">All</option>
                      {categories.map((item: string, index: number) => (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <button
                      className={`w-full  px-2 py-0.5 text-sm rounded border border-gray-300 dark:border-gray-600 bg-transparent cursor-pointer ${
                        theme === "dark"
                          ? "hover:dark:bg-black"
                          : "hover:bg-black hover:text-white"
                      }   transition-colors`}
                      onClick={() =>
                        setFilter(() => ({
                          category: "",
                          date: {
                            startDate: "",
                            endDate: "",
                          },
                          type: "",
                        }))
                      }
                    >
                      Clear all
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Add Transaction Button */}
            <div className="flex-1 w-full sm:w-auto md:hidden">
              <Button
                className="w-full flex justify-center items-center gap-2 text-[12px] py-[9px] sm:py-1.5 sm:text-base"
                onClick={() => {
                  setModalDetail((pre) => ({
                    ...pre,
                    modalId: "add",
                    transactionId: "",
                  }));
                  dispatch(handleOpenAndCloseModal());
                }}
              >
                <FaPlus /> Add Transaction
              </Button>
            </div>
          </div>
          <InputAndLabel
            name="search"
            type="text"
            placeHolder="search description/category"
            labelStyle="hidden"
            inputStyle={`px-2 py-1.5 placeholder:text-gray-400 !border placeholder:text-[12px]  ${
              theme === "dark" ? "!border-white/20" : ""
            }`}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
          />
        </div>
      </div>
      <div className="overflow-x-auto scroll-smooth">
        {!loading && (data?.length ?? 0) <= 0 ? (
          <Text
            Element="p"
            isDes
            style="text-center text-gray-300 !text-xl"
            text="There are no Transaction"
          />
        ) : (
          <table
            className={`min-w-full border   shadow text-sm rounded-md ${
              theme === "dark"
                ? "bg-[#2A2B30] border-gray-700"
                : "bg-white border-gray-300"
            }`}
          >
            <thead
              className={`${
                theme === "dark"
                  ? "bg-[#3A3B40] text-white"
                  : "bg-gray-100 text-gray-700"
              } text-left`}
            >
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const isRecurring =
                      header.column.columnDef.header === "Recurring";
                    const isAction =
                      header.column.columnDef.header === "Actions";
                    return (
                      <th
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        className={`p-3 cursor-pointer text-nowrap select-none ${
                          isRecurring
                            ? "text-center"
                            : isAction
                            ? "text-right"
                            : ""
                        }`}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " ↑",
                          desc: " ↓",
                        }[header.column.getIsSorted() as string] ?? null}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {loading
                ? // Skeleton rows (same number as current page limit)
                  Array.from({ length: 10 }).map((_, idx) => (
                    <tr key={idx} className="border-t animate-pulse">
                      {table.getAllColumns().map((col, colIdx) => (
                        <td key={colIdx} className="p-3">
                          <div
                            className={`h-4 rounded bg-gray-300 dark:bg-gray-600 ${
                              col.columnDef.header === "Actions"
                                ? "w-12 ml-auto"
                                : "w-full"
                            }`}
                          ></div>
                        </td>
                      ))}
                    </tr>
                  ))
                : table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className={`border-t transition-colors hover:${
                        theme === "dark" ? "bg-[#3A3B40]" : "bg-gray-50"
                      }`}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="p-3 text-nowrap">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
            </tbody>
          </table>
        )}
      </div>
      {!loading && (data?.length ?? 0) <= 0 ? (
        <></>
      ) : (
        <>
          <div className="md:flex hidden items-baseline justify-between mt-4 px-2 flex-wrap gap-4">
            <span className="text-sm">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <div className="flex items-baseline gap-4">
              <div className="flex items-center gap-2">
                <label
                  htmlFor="rows-per-page"
                  className="text-sm whitespace-nowrap"
                >
                  Rows per page:
                </label>
                <select
                  id="rows-per-page"
                  value={pagination.limit}
                  onChange={handleChangeRowsPerPage}
                  className={`border px-2 py-1 rounded text-sm ${
                    theme === "dark"
                      ? "bg-[#2A2B30] text-white border-gray-600"
                      : "bg-white text-black border-gray-300"
                  }`}
                >
                  {[5, 10, 20, 50].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex  gap-2 sm:mt-4 ">
                <button
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      page: Math.max(prev.page - 1, 1),
                    }))
                  }
                  disabled={pagination.page === 1}
                  className={`px-3 py-1 border rounded cursor-pointer ${
                    pagination.page === 1
                      ? "opacity-50 !cursor-not-allowed"
                      : theme === "dark"
                      ? "text-white border-gray-600"
                      : "text-black border-gray-300"
                  }`}
                >
                  Previous
                </button>

                <button
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      page: Math.min(prev.page + 1, prev.totalPages),
                    }))
                  }
                  disabled={pagination.page === pagination.totalPages}
                  className={`px-3 py-1 border rounded cursor-pointer ${
                    pagination.page === pagination.totalPages
                      ? "opacity-50 !cursor-not-allowed"
                      : theme === "dark"
                      ? "text-white border-gray-600"
                      : "text-black border-gray-300"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
          <div className=" md:hidden flex flex-col gap-4 items-center">
            <div className=" mt-4 flex items-center w-full justify-between">
              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    page: Math.max(prev.page - 1, 1),
                  }))
                }
                disabled={pagination.page === 1}
                className={`px-3 py-1 border rounded ${
                  pagination.page === 1
                    ? "opacity-50 cursor-not-allowed"
                    : theme === "dark"
                    ? "text-white border-gray-600"
                    : "text-black border-gray-300"
                }`}
              >
                Previous
              </button>
              <span className="text-sm">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    page: Math.min(prev.page + 1, prev.totalPages),
                  }))
                }
                disabled={pagination.page === pagination.totalPages}
                className={`px-3 py-1 border rounded ${
                  pagination.page === pagination.totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : theme === "dark"
                    ? "text-white border-gray-600"
                    : "text-black border-gray-300"
                }`}
              >
                Next
              </button>
            </div>
            <div className="flex items-center gap-2">
              <label
                htmlFor="rows-per-page"
                className="text-sm whitespace-nowrap"
              >
                Rows per page:
              </label>
              <select
                id="rows-per-page"
                value={pagination.limit}
                onChange={handleChangeRowsPerPage}
                className={`border px-2 py-1 rounded text-sm ${
                  theme === "dark"
                    ? "bg-[#2A2B30] text-white border-gray-600"
                    : "bg-white text-black border-gray-300"
                }`}
              >
                {[5, 10, 20, 50].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}

      {isOpen && (
        <Modal
          id={modalDetail.modalId}
          transactionId={modalDetail.transactionId}
        />
      )}
    </div>
  );
};

export default TransactionTable;
