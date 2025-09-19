"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Search, Filter, ShoppingCart, Shield, Eye } from "lucide-react"
import type { MarketplaceItem } from "@/lib/trading-types"

const mockItems: MarketplaceItem[] = [
  {
    id: "1",
    sellerId: "seller1",
    title: "Premium Trading Bot License",
    description: "Advanced algorithmic trading bot with proven track record. Includes 1-year support.",
    category: "Software",
    price: 299.99,
    currency: "USD",
    images: ["/trading-bot-interface.jpg"],
    tags: ["trading", "bot", "algorithm", "premium"],
    status: "active",
    escrowEnabled: true,
    rating: 4.8,
    reviewCount: 127,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    sellerId: "seller2",
    title: "Cryptocurrency Market Analysis Course",
    description: "Complete course on technical analysis and market psychology for crypto trading.",
    category: "Education",
    price: 149.99,
    currency: "USD",
    images: ["/cryptocurrency-course-materials.jpg"],
    tags: ["education", "crypto", "analysis", "course"],
    status: "active",
    escrowEnabled: true,
    rating: 4.9,
    reviewCount: 89,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    sellerId: "seller3",
    title: "Custom Trading Indicators Pack",
    description: "Collection of 15 custom TradingView indicators for advanced market analysis.",
    category: "Tools",
    price: 79.99,
    currency: "USD",
    images: ["/trading-indicators-charts.jpg"],
    tags: ["indicators", "tradingview", "analysis", "tools"],
    status: "active",
    escrowEnabled: false,
    rating: 4.6,
    reviewCount: 234,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    sellerId: "seller4",
    title: "NFT Collection - Digital Art",
    description: "Unique digital art collection featuring 100 hand-crafted NFTs with utility tokens.",
    category: "NFT",
    price: 0.5,
    currency: "ETH",
    images: ["/digital-art-nft-collection.png"],
    tags: ["nft", "art", "digital", "collectible"],
    status: "active",
    escrowEnabled: true,
    rating: 4.7,
    reviewCount: 56,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    sellerId: "seller5",
    title: "DeFi Yield Farming Strategy Guide",
    description: "Comprehensive guide to maximizing yields in DeFi protocols with risk management.",
    category: "Education",
    price: 199.99,
    currency: "USD",
    images: ["/defi-yield-farming-guide.jpg"],
    tags: ["defi", "yield", "farming", "strategy"],
    status: "active",
    escrowEnabled: true,
    rating: 4.5,
    reviewCount: 78,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "6",
    sellerId: "seller6",
    title: "Smart Contract Audit Service",
    description: "Professional smart contract security audit with detailed report and recommendations.",
    category: "Services",
    price: 999.99,
    currency: "USD",
    images: ["/smart-contract-code-audit.jpg"],
    tags: ["audit", "security", "smart contract", "service"],
    status: "active",
    escrowEnabled: true,
    rating: 5.0,
    reviewCount: 23,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export function MarketplaceGrid() {
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [filteredItems, setFilteredItems] = useState(mockItems)

  const categories = ["all", "Software", "Education", "Tools", "NFT", "Services"]

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    filterItems(term, category, sortBy)
  }

  const handleCategoryChange = (cat: string) => {
    setCategory(cat)
    filterItems(searchTerm, cat, sortBy)
  }

  const handleSortChange = (sort: string) => {
    setSortBy(sort)
    filterItems(searchTerm, category, sort)
  }

  const filterItems = (search: string, cat: string, sort: string) => {
    let filtered = mockItems

    // Filter by search term
    if (search) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          item.description.toLowerCase().includes(search.toLowerCase()) ||
          item.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase())),
      )
    }

    // Filter by category
    if (cat !== "all") {
      filtered = filtered.filter((item) => item.category === cat)
    }

    // Sort items
    switch (sort) {
      case "price_low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price_high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
      default:
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        break
    }

    setFilteredItems(filtered)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ))
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search marketplace..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={category} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full md:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat === "all" ? "All Categories" : cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="price_low">Price: Low to High</SelectItem>
            <SelectItem value="price_high">Price: High to Low</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{filteredItems.length} items found</p>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video relative overflow-hidden">
              <img src={item.images[0] || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 flex space-x-1">
                {item.escrowEnabled && (
                  <Badge variant="secondary" className="text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    Escrow
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs bg-background/80">
                  {item.category}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-sm line-clamp-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{item.description}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">{renderStars(item.rating)}</div>
                  <span className="text-xs text-muted-foreground">
                    {item.rating} ({item.reviewCount})
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div>
                    <span className="text-lg font-bold">
                      {item.price} {item.currency}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="bg-transparent">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm">
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Buy
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No items found matching your criteria.</p>
            <p className="text-sm mt-1">Try adjusting your search or filters.</p>
          </div>
        </div>
      )}
    </div>
  )
}
