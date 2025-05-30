"use client"

import { useState } from "react"
import { Search, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"

export function SearchFilters() {
  const [showFilters, setShowFilters] = useState(false)
  const [ageRange, setAgeRange] = useState([18, 35])
  const [searchTerm, setSearchTerm] = useState("")

  const locations = ["Santo Domingo", "Santiago", "Puerto Plata", "La Romana", "Punta Cana", "San Pedro"]
  const interests = ["Travel", "Music", "Dancing", "Art", "Cooking", "Reading", "Fitness", "Beach", "Photography"]

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="search"
            placeholder="Search by name, location, or interests..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filters
          {showFilters && <X className="w-4 h-4" />}
        </Button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {/* Age Range */}
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Age Range: {ageRange[0]} - {ageRange[1]}
                </Label>
                <Slider value={ageRange} onValueChange={setAgeRange} max={50} min={18} step={1} className="w-full" />
              </div>

              {/* Location */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Location</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {locations.slice(0, 4).map((location) => (
                    <div key={location} className="flex items-center space-x-2">
                      <Checkbox id={location} />
                      <Label htmlFor={location} className="text-sm">
                        {location}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Interests</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {interests.slice(0, 4).map((interest) => (
                    <div key={interest} className="flex items-center space-x-2">
                      <Checkbox id={interest} />
                      <Label htmlFor={interest} className="text-sm">
                        {interest}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Filters */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Options</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="featured" />
                    <Label htmlFor="featured" className="text-sm">
                      Featured only
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="verified" />
                    <Label htmlFor="verified" className="text-sm">
                      Verified profiles
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="online" />
                    <Label htmlFor="online" className="text-sm">
                      Recently active
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setShowFilters(false)}>
                Clear Filters
              </Button>
              <Button className="bg-pink-500 hover:bg-pink-600">Apply Filters</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
