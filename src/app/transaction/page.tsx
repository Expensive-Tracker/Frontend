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
import { FaEdit, FaPlus } from "react-icons/fa";
import { FiDelete } from "react-icons/fi";
import { formatDate } from "@/util/services/date";
import Badge from "@/components/common/badge";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Transaction } from "@/util/interface/api";
import Button from "@/components/common/button";
import InputAndLabel from "@/components/common/inputAndLabel";
import { useDebounce } from "@uidotdev/usehooks";
import { TfiAngleDown } from "react-icons/tfi";
import { handleGetTransaction } from "@/util/api/apis/transaction";

const TransactionTable = () => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const userId = useSelector((state: RootState) => state.user.userDetail._id);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<Transaction[]>();
  const [showFilter, setShowFilter] = useState<boolean>(false);
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

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchTransactionList();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [pagination.limit, pagination.page, debounceSearch]);

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

  function handleTransactionEdit(id: number | string) {
    console.log("Edit transaction:", id);
  }

  const fetchTransactionList = useCallback(async () => {
    try {
      setLoading(true);
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
      console.log(userId);

      setData(response.result.data.transactions);
      setPagination((prev) => ({
        ...prev,
        ...response.result.data.pagination,
      }));
    } catch (err: any) {
      console.error("Failed to fetch transactions:", err.message);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, debounceSearch, filter]);

  const handleTransactionDelete = (id: number | string) => {
    console.log("Delete transaction:", id);
  };

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
            }`}
          >
            {desc || "—"}
          </span>
        );
      },
    },
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
      header: "Recurring",
      accessorKey: "isRecurring",
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
              onClick={() => handleTransactionEdit(row.original._id)}
              title="Edit"
              className={`p-2 border rounded-full hover:text-blue-600 ${
                theme === "dark"
                  ? "border-gray-600 text-gray-300 hover:border-blue-400"
                  : "border-gray-300 text-gray-600"
              }`}
            >
              <FaEdit />
            </button>
            <button
              onClick={() => handleTransactionDelete(row.original._id)}
              title="Delete"
              className={`p-2 border rounded-full hover:text-red-600 ${
                theme === "dark"
                  ? "border-gray-600 text-gray-300 hover:border-red-400"
                  : "border-gray-300 text-gray-600"
              }`}
            >
              <FiDelete />
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

  return (
    <div
      className={`p-4 py-6 ${
        theme === "dark" ? "bg-[#1B1C21] text-white" : "bg-white text-black"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="lg:flex items-center gap-4">
          <h2 className="text-xl font-semibold ">Transactions</h2>
          <Button className="lg:flex hidden items-center gap-2">
            <FaPlus /> Add Transaction
          </Button>
        </div>
        <div className="grid grid-cols-[100px_auto] gap-4 ">
          <div className="relative">
            <Button
              className="w-full flex justify-between items-center"
              onClick={() => setShowFilter((prev) => !prev)}
            >
              Filter <TfiAngleDown size={14} />
            </Button>
            {showFilter && (
              <div
                className={`absolute shadow-md right-0 top-[45px] px-4 py-3 w-[220px] rounded-md space-y-4 z-10 ${
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
                    <option value="food">Food</option>
                    <option value="transport">Transport</option>
                    <option value="bills">Bills</option>
                    <option value="shopping">Shopping</option>
                  </select>
                </div>
              </div>
            )}
          </div>
          <InputAndLabel
            name="search"
            type="text"
            placeHolder="search..."
            labelStyle="hidden"
            inputStyle="px-2 py-1.5 placeholder:text-gray-400"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
          />
        </div>
      </div>
      <div className="overflow-x-auto scroll-smooth">
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
                  const isAction = header.column.columnDef.header === "Actions";
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
                Array.from({ length: pagination.limit }).map((_, idx) => (
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
      </div>
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
        </div>
      </div>
      <div className="md:hidden mt-4 flex items-center justify-between">
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
    </div>
  );
};

export default TransactionTable;
