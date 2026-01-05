import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

export interface PaginationProps {
  currentPage: number
  total: number // data total
  pageSize: number // page size
  onPageChange: (page: number) => void
}

/**
 * Pagination component
 * Based on the design, the pagination component supports page number jumping and left and right page turning
 * @param currentPage current page number (starts from 1)
 * @param total data total
 * @param pageSize page size
 * @param onPageChange page number change callback
 */
export function Pagination({
  currentPage,
  total,
  pageSize,
  onPageChange
}: PaginationProps) {
  // calculate total pages
  const totalPages = Math.ceil(total / pageSize)

  // generate page number array
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisiblePages = 5 // maximum 5 consecutive page numbers displayed

    if (totalPages <= 7) {
      // total pages less than or equal to 7, all displayed
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // always display the first page
      pages.push(1)

      // calculate the middle displayed page numbers
      if (currentPage <= 3) {
        // current page is in front, display 1,2,3,4,5,...,89
        for (let i = 2; i <= maxVisiblePages; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        // current page is in back, display 1,...,85,86,87,88,89
        pages.push("...")
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // current page is in middle, display 1,...,4,5,6,...,89
        pages.push("...")
        pages.push(currentPage - 1)
        pages.push(currentPage)
        pages.push(currentPage + 1)
        pages.push("...")
        pages.push(totalPages)
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      {/* left page turn button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "flex size-10 items-center justify-center rounded-[4px] bg-[#F5F7FA] transition-all",
          currentPage === 1
            ? "cursor-not-allowed opacity-40"
            : "cursor-pointer hover:opacity-80"
        )}
      >
        <ChevronLeft className="size-5 text-[#020328]" />
      </button>

      {/* page number button */}
      {pageNumbers.map((page, index) => {
        if (page === "...") {
          return (
            <div
              key={`ellipsis-${index}`}
              className="flex size-10 items-center justify-center"
            >
              <MoreHorizontal className="size-5 text-[#020328]/40" />
            </div>
          )
        }

        const pageNum = page as number
        const isActive = pageNum === currentPage

        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={cn(
              "flex size-10 cursor-pointer items-center justify-center rounded-[4px] text-[14px] font-medium transition-all",
              isActive
                ? "bg-[#FE5827] text-white"
                : "bg-[#F5F7FA] text-[#020328] hover:opacity-80"
            )}
          >
            {pageNum}
          </button>
        )
      })}

      {/* right page turn button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "flex size-10 items-center justify-center rounded-[4px] bg-[#F5F7FA] transition-all",
          currentPage === totalPages
            ? "cursor-not-allowed opacity-40"
            : "cursor-pointer hover:opacity-80"
        )}
      >
        <ChevronRight className="size-5 text-[#020328]" />
      </button>
    </div>
  )
}
