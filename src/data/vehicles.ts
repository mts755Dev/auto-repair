import { Vehicle } from '@/types';

export type DemoVehicleSeed = Omit<Vehicle, 'id' | 'userId' | 'createdAt'>;

export const DEMO_VEHICLES: DemoVehicleSeed[] = [
  {
    nickname: 'Daily driver',
    make: 'Toyota',
    model: 'Camry',
    year: 2021,
    trim: 'SE',
    licensePlate: '7AXJ429',
    vin: '4T1BF1FK5CU567213',
    mileage: 42180,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    color: 'Silver Metallic',
    isPrimary: true,
  },
  {
    nickname: 'Weekend SUV',
    make: 'Honda',
    model: 'CR-V',
    year: 2019,
    trim: 'EX-L',
    licensePlate: '6BQL812',
    vin: '2HKRW2H85KH601234',
    mileage: 71540,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    color: 'Obsidian Blue',
  },
];
