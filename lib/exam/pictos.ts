// Pictograms for picture options and speaking cards. Content refers to the German key; the generator
// picks from PICTO_KEYS, so a draft can never name an icon that doesn't exist.
// TODO(hannes): the real exams use drawings. Pictograms stand in until we commission illustrations.

import {
  AlarmClock, Apple, Armchair, Backpack, Banana, Banknote, Bath, Bed, Beer, Bike, BookOpen, Briefcase, Building2, Bus, CakeSlice, CalendarDays, Camera, Car, Carrot,
  Cat, Cherry, Church, CigaretteOff, CircleParking, Clapperboard, Clock, CloudRain, Coffee, Cookie, CookingPot, CreditCard, Croissant, CupSoda, Dog, DoorOpen, Dumbbell,
  Egg, Fish, Flower2, Footprints, Fuel, Gamepad2, Gift, Glasses, GlassWater, Globe, Grape, Guitar, Hospital, Hotel, House, IceCreamCone, Key, Lamp, Landmark,
  Laptop, Library, Luggage, Mail, Mailbox, Map, MapPin, Milk, Mountain, Music, Newspaper, Palette, PartyPopper, Pen, Phone, Pill, Pizza, Plane, Popcorn, Printer,
  Refrigerator, Salad, Sandwich, School, Scissors, ShoppingBag, ShoppingCart, Shirt, ShowerHead, Smartphone, Snowflake, Sofa, Soup, Stethoscope, Store, Sun, Tent,
  Theater, Thermometer, Ticket, Toilet, TrainFront, TramFront, TreePine, Trophy, Tv, Umbrella, UtensilsCrossed, Volleyball, Wallet, WashingMachine, Watch, Waves,
  Wine, Wrench, type LucideIcon,
} from "lucide-react"

export const PICTOS = {
  wecker: AlarmClock, apfel: Apple, sessel: Armchair, rucksack: Backpack, banane: Banana, geldschein: Banknote, badewanne: Bath, bett: Bed, bier: Beer, fahrrad: Bike,
  buch: BookOpen, aktentasche: Briefcase, buero: Building2, bus: Bus, kuchen: CakeSlice, kalender: CalendarDays, kamera: Camera, auto: Car, karotte: Carrot, katze: Cat,
  kirschen: Cherry, kirche: Church, rauchen_verboten: CigaretteOff, parkplatz: CircleParking, kino: Clapperboard, uhr: Clock, regen: CloudRain, kaffee: Coffee, keks: Cookie,
  kochtopf: CookingPot, kreditkarte: CreditCard, croissant: Croissant, limonade: CupSoda, hund: Dog, tuer: DoorOpen, fitness: Dumbbell, ei: Egg, fisch: Fish, blume: Flower2,
  schuhe: Footprints, tankstelle: Fuel, spielkonsole: Gamepad2, geschenk: Gift, brille: Glasses, wasser: GlassWater, welt: Globe, trauben: Grape, gitarre: Guitar,
  krankenhaus: Hospital, hotel: Hotel, haus: House, eis: IceCreamCone, schluessel: Key, lampe: Lamp, bank: Landmark, laptop: Laptop, bibliothek: Library, koffer: Luggage,
  brief: Mail, briefkasten: Mailbox, stadtplan: Map, ort: MapPin, milch: Milk, berge: Mountain, musik: Music, zeitung: Newspaper, malen: Palette, party: PartyPopper,
  kuli: Pen, telefon: Phone, tabletten: Pill, pizza: Pizza, flugzeug: Plane, popcorn: Popcorn, drucker: Printer, kuehlschrank: Refrigerator, salat: Salad,
  sandwich: Sandwich, schule: School, schere: Scissors, einkaufstasche: ShoppingBag, einkaufswagen: ShoppingCart, tshirt: Shirt, dusche: ShowerHead, handy: Smartphone,
  schnee: Snowflake, sofa: Sofa, suppe: Soup, arzt: Stethoscope, geschaeft: Store, sonne: Sun, zelt: Tent, theater: Theater, fieber: Thermometer, ticket: Ticket,
  toilette: Toilet, zug: TrainFront, strassenbahn: TramFront, baum: TreePine, pokal: Trophy, fernseher: Tv, regenschirm: Umbrella, restaurant: UtensilsCrossed,
  volleyball: Volleyball, geldbeutel: Wallet, waschmaschine: WashingMachine, armbanduhr: Watch, schwimmen: Waves, wein: Wine, werkzeug: Wrench,
} satisfies Record<string, LucideIcon>

export type Picto = keyof typeof PICTOS
export const PICTO_KEYS = Object.keys(PICTOS) as [Picto, ...Picto[]]
export const pictoIcon = (key?: string): LucideIcon | undefined => (key ? PICTOS[key as Picto] : undefined)
