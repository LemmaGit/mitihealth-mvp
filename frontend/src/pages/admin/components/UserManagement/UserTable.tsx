import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { UserEntry } from "./types";

const roleBadgeClasses: Record<string, string> = {
  patient: "bg-primary/10 text-primary",
  practitioner: "bg-secondary/10 text-secondary",
  supplier: "bg-accent/10 text-accent-foreground",
  admin: "bg-destructive/10 text-destructive",
};

const statusBadgeClasses: Record<string, string> = {
  active: "bg-primary/10 text-primary",
  suspended: "bg-destructive/10 text-destructive",
  pending: "bg-secondary/10 text-secondary",
};

interface UserTableProps {
  paginatedUsers: UserEntry[];
  filteredUsersLength: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  roleFilter: string;
  onRoleFilterChange: (value: string) => void;
  onPageChange: (page: number) => void;
}

export default function UserTable({
  paginatedUsers,
  filteredUsersLength,
  currentPage,
  totalPages,
  itemsPerPage,
  roleFilter,
  onRoleFilterChange,
  onPageChange,
}: UserTableProps) {
  return (
    <div className="rounded-xl bg-card shadow-botanical">
      <div className="flex flex-col gap-3 border-b border-border/15 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Select value={roleFilter} onValueChange={onRoleFilterChange}>
            <SelectTrigger className="h-9 w-40 bg-muted/50 text-sm">
              <SelectValue placeholder="Filter by Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="patient">Patient</SelectItem>
              <SelectItem value="practitioner">Practitioner</SelectItem>
              <SelectItem value="supplier">Supplier</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="hidden sm:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Name</TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Role</TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Date Joined</TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id} className="border-border/10">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                       <AvatarImage
                        src={user.profilePicture}
                        alt={user.name}
                        />
                      <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                        {user.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-foreground">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={`text-[10px] font-semibold uppercase tracking-widest ${roleBadgeClasses[user.role] || roleBadgeClasses.patient}`}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{user.dateJoined}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={`text-[10px] font-semibold capitalize ${statusBadgeClasses[user.status]}`}>
                    {user.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            
            {paginatedUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-3 p-4 sm:hidden">
        {paginatedUsers.map((user) => (
          <div key={user.id} className="rounded-lg bg-muted/30 p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                  {user.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.dateJoined}</p>
              </div>
              <Badge variant="secondary" className={`text-[10px] font-semibold capitalize ${statusBadgeClasses[user.status]}`}>
                {user.status}
              </Badge>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <Badge variant="secondary" className={`text-[10px] font-semibold uppercase tracking-widest ${roleBadgeClasses[user.role] || roleBadgeClasses.patient}`}>
                {user.role}
              </Badge>
            </div>
          </div>
        ))}
        
        {paginatedUsers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No users found.
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-border/15 px-4 py-3">
        <p className="text-xs text-muted-foreground">
          Showing {filteredUsersLength === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredUsersLength)} of {filteredUsersLength} users
        </p>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
