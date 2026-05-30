// Prop dimensions and component registry.
// Maps prop type string → [width, height, depth] in meters.
// Components are imported dynamically in StageProp.jsx.

import Sofa from '../components/props/furniture/Sofa.jsx'
import CoffeeTable from '../components/props/furniture/CoffeeTable.jsx'
import DiningTable from '../components/props/furniture/DiningTable.jsx'
import BedFrame from '../components/props/furniture/BedFrame.jsx'
import Wardrobe from '../components/props/furniture/Wardrobe.jsx'
import Bookshelf from '../components/props/furniture/Bookshelf.jsx'
import Nightstand from '../components/props/furniture/Nightstand.jsx'
import Refrigerator from '../components/props/appliances/Refrigerator.jsx'
import Television from '../components/props/appliances/Television.jsx'
import KitchenCabinets from '../components/props/appliances/KitchenCabinets.jsx'
import InteractiveLamp from '../components/props/appliances/InteractiveLamp.jsx'
import StageCurtain from '../components/props/stage/StageCurtain.jsx'
import WindowCurtain from '../components/props/stage/WindowCurtain.jsx'
import AnimatedDoorFlat from '../components/props/stage/AnimatedDoorFlat.jsx'
import InteractivePropTable from '../components/props/stage/InteractivePropTable.jsx'
import StageCouches from '../components/props/stage/StageCouches.jsx'
import Piano from '../components/props/orchestra/Piano.jsx'
import DrumSet from '../components/props/orchestra/DrumSet.jsx'
import Harp from '../components/props/orchestra/Harp.jsx'
import MusicStand from '../components/props/orchestra/MusicStand.jsx'
import ConductorsPodium from '../components/props/orchestra/ConductorsPodium.jsx'
import Microphones from '../components/props/orchestra/Microphones.jsx'
import MusicianChair from '../components/props/orchestra/MusicianChair.jsx'
import DramaChair1Red from '../components/props/drama/DramaChair1Red.jsx'
import DramaChair2Blue from '../components/props/drama/DramaChair2Blue.jsx'
import DramaChair3Green from '../components/props/drama/DramaChair3Green.jsx'
import Cube from '../components/props/shapes/Cube.jsx'
import Cylinder from '../components/props/shapes/Cylinder.jsx'
import Sphere from '../components/props/shapes/Sphere.jsx'
import Cone from '../components/props/shapes/Cone.jsx'
import Pyramid from '../components/props/shapes/Pyramid.jsx'
import RectangularPrism from '../components/props/shapes/RectangularPrism.jsx'
import Dancer from '../components/props/shapes/Dancer.jsx'

export const PROP_REGISTRY = {
  "Sofa / Couch":                               { component: Sofa, dims: [1.83, 0.79, 1.52] },
  "Coffee table":                               { component: CoffeeTable, dims: [0.965, 0.47, 0.965] },
  "Dining table and chairs":                    { component: DiningTable, dims: [2.5, 0.76, 1.6] },
  "Bed frame and mattress":                     { component: BedFrame, dims: [1.65, 1.12, 2.15] },
  "Wardrobe / Dresser":                         { component: Wardrobe, dims: [1.20, 1.82, 0.55] },
  "Bookshelf":                                  { component: Bookshelf, dims: [0.77, 1.22, 0.30] },
  "Nightstand":                                 { component: Nightstand, dims: [0.47, 0.68, 0.40] },
  "Refrigerator":                               { component: Refrigerator, dims: [0.912, 1.825, 0.72] },
  "Television":                                 { component: Television, dims: [1.8, 1.14, 0.5] },
  "Kitchen Cabinets":                           { component: KitchenCabinets, dims: [2.3, 2.3, 0.6] },
  "Curtains / Blinds":                          { component: WindowCurtain, dims: [2.44, 2.74, 0.2] },
  "Floor Lamp 1 (Wood)":                        { component: InteractiveLamp, dims: [0.4, 1.48, 0.4], extraProps: { type: 1 } },
  "Floor Lamp 2 (Metal)":                       { component: InteractiveLamp, dims: [0.4, 1.48, 0.4], extraProps: { type: 2 } },
  "Stage Curtain":                              { component: StageCurtain, dims: null }, // dynamic bounds
  "Stage couches or armchairs":                 { component: StageCouches, dims: [1.83, 0.79, 1.52] },
  "Prop tables and chairs":                     { component: InteractivePropTable, dims: [2.8, 0.76, 1.6] },
  "Fake doors or window frames (flats)":        { component: AnimatedDoorFlat, dims: [1.22, 2.13, 1.22] },
  "Cube (Grey)":                                { component: Cube, dims: [0.5, 0.5, 0.5] },
  "Cylinder (Grey)":                            { component: Cylinder, dims: [0.5, 0.5, 0.5] },
  "Sphere (Grey)":                              { component: Sphere, dims: [0.56, 0.56, 0.56] },
  "Cone (Grey)":                                { component: Cone, dims: [0.56, 0.5, 0.56] },
  "Pyramid (Grey)":                             { component: Pyramid, dims: [0.7, 0.5, 0.7] },
  "Rectangular Prism (Grey)":                   { component: RectangularPrism, dims: [0.8, 0.3, 0.4] },
  "Drama Chair 1 (Red)":                        { component: DramaChair1Red, dims: [0.55, 0.75, 0.53] },
  "Drama Chair 2 (Blue)":                       { component: DramaChair2Blue, dims: [0.50, 0.83, 0.52] },
  "Drama Chair 3 (Green)":                      { component: DramaChair3Green, dims: [0.42, 0.92, 0.49] },
  "Musician chairs":                            { component: MusicianChair, dims: [0.43, 0.97, 0.43] },
  "Conductor's podium":                         { component: ConductorsPodium, dims: [1.0, 1.2, 1.0] },
  "Music stands":                               { component: MusicStand, dims: [0.51, 1.22, 0.40] },
  "Drum set":                                   { component: DrumSet, dims: [1.5, 1.2, 1.2] },
  "Microphones":                                { component: Microphones, dims: [0.4, 1.7, 0.4] },
  "Harp":                                       { component: Harp, dims: [0.42, 1.52, 0.72] },
  "Piano":                                      { component: Piano, dims: [1.47, 1.5, 1.55] },
  "Dancer":                                     { component: Dancer, dims: [0.5, 1.7, 0.5] },
}

export function getPropDims(type, bounds = { width: 15, height: 6, length: 10 }) {
  if (type === 'Stage Curtain') {
    return [bounds.width, bounds.height, 0.5]
  }
  const entry = PROP_REGISTRY[type]
  return entry ? entry.dims : [0.8, 0.8, 0.8]
}
