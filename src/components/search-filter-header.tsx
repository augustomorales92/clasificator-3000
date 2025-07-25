import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Filter, Search, SortAsc, SortDesc, X } from 'lucide-react'

export interface SortOption {
  value: string
  label: string
}

export interface ActiveFilter {
  id: string
  label: string
  value: string
}

interface SearchFilterHeaderProps {
  searchPlaceholder?: string
  searchTerm: string
  onSearchChange: (value: string) => void
  sortOptions: SortOption[]
  selectedSort: string
  onSortChange: (value: string) => void
  sortOrder: 'asc' | 'desc'
  onSortOrderChange: () => void
  activeFilters: ActiveFilter[]
  onRemoveFilter: (filterId: string) => void
  onClearFilters: () => void
  onOpenAdvancedFilters: () => void
  activeFiltersCount: number
}

export function SearchFilterHeader({
  searchPlaceholder = 'Search...',
  searchTerm,
  onSearchChange,
  sortOptions,
  selectedSort,
  onSortChange,
  sortOrder,
  onSortOrderChange,
  activeFilters,
  onRemoveFilter,
  onClearFilters,
  onOpenAdvancedFilters,
  activeFiltersCount,
}: SearchFilterHeaderProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedSort} onValueChange={onSortChange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={onSortOrderChange}>
            {sortOrder === 'asc' ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            className="relative bg-transparent"
            onClick={onOpenAdvancedFilters}
          >
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
            {activeFiltersCount > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* Active Filters Display */}
        {activeFilters.length > 0 && (
          <div className="flex items-center justify-between mt-4">
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter) => (
                <Badge
                  key={filter.id}
                  variant="secondary"
                  className="pl-2 pr-1 flex items-center gap-1"
                >
                  {filter.label}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 hover:bg-transparent p-0"
                    onClick={() => onRemoveFilter(filter.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
