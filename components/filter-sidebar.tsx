"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function FilterSidebar() {
  const [ageRange, setAgeRange] = useState([18, 35])
  const [priceRange, setPriceRange] = useState([20, 50])

  const locations = ["Santo Domingo", "Santiago", "Puerto Plata", "La Romana", "Punta Cana", "San Pedro"]

  const interests = [
    "Travel",
    "Music",
    "Dancing",
    "Art",
    "Cooking",
    "Reading",
    "Fitness",
    "Beach",
    "Photography",
    "Movies",
    "Nature",
    "Yoga",
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Age Range */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Age Range: {ageRange[0]} - {ageRange[1]}
          </Label>
          <Slider value={ageRange} onValueChange={setAgeRange} max={50} min={18} step={1} className="w-full" />
        </div>

        <Separator />

        {/* Price Range */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Price Range: ${priceRange[0]} - ${priceRange[1]}
          </Label>
          <Slider value={priceRange} onValueChange={setPriceRange} max={100} min={10} step={5} className="w-full" />
        </div>

        <Separator />

        {/* Location */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Location</Label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {locations.map((location) => (
              <div key={location} className="flex items-center space-x-2">
                <Checkbox id={location} />
                <Label htmlFor={location} className="text-sm">
                  {location}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Interests */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Interests</Label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {interests.map((interest) => (
              <div key={interest} className="flex items-center space-x-2">
                <Checkbox id={interest} />
                <Label htmlFor={interest} className="text-sm">
                  {interest}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Featured Only */}
        <div className="flex items-center space-x-2">
          <Checkbox id="featured" />
          <Label htmlFor="featured" className="text-sm">
            Featured profiles only
          </Label>
        </div>

        <Button className="w-full" variant="outline">
          Clear Filters
        </Button>
      </CardContent>
    </Card>
  )
}
