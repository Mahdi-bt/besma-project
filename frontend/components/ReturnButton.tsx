import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

interface ReturnButtonProps {
  href?: string
  className?: string
}

export default function ReturnButton({ href, className = '' }: ReturnButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (href) {
      router.push(href)
    } else {
      router.back()
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors ${className}`}
    >
      <ArrowLeft className="w-5 h-5" />
      <span>Retour</span>
    </button>
  )
} 