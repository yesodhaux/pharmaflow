
import { useState } from "react";
import { Transfer } from "@/contexts/TransferContext";
import { BranchId } from "@/contexts/AuthContext";
import { format } from "date-fns";

export function useTransferHistory(allTransfers: Transfer[]) {
  const [branchFilter, setBranchFilter] = useState<BranchId | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<string>("all");

  // Order by date (newest first)
  const sortedTransfers = [...allTransfers].sort((a, b) => {
    return new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime();
  });

  // Get unique dates for the date filter
  const uniqueDates: string[] = [];
  sortedTransfers.forEach(transfer => {
    const date = format(new Date(transfer.requestDate), "yyyy-MM-dd");
    if (!uniqueDates.includes(date)) {
      uniqueDates.push(date);
    }
  });

  // Filter transfers
  const filteredTransfers = sortedTransfers.filter(transfer => {
    // Filter by branch
    const matchesBranch = 
      branchFilter === "all" || 
      (branchFilter === transfer.fromBranch || branchFilter === transfer.toBranch);
    
    // Filter by search query
    const matchesSearch = 
      transfer.product.toLowerCase().includes(searchQuery.toLowerCase()) || 
      transfer.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by date
    const matchesDate = 
      dateFilter === "all" || 
      format(new Date(transfer.requestDate), "yyyy-MM-dd") === dateFilter;
    
    return matchesBranch && matchesSearch && matchesDate;
  });

  return {
    branchFilter,
    setBranchFilter,
    searchQuery,
    setSearchQuery,
    dateFilter,
    setDateFilter,
    filteredTransfers,
    uniqueDates
  };
}
