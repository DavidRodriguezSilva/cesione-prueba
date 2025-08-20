import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ITenantProps } from '../models'

export interface TenantState extends Partial<ITenantProps> {
	setTenantState: (tenant: Partial<ITenantProps>) => void
}

export const useTenantStore = create<TenantState>()(
	persist(
		(set) => ({
			isActive: false,
			setTenantState: (tenant) =>
				set((state) => ({
					...state,
					...tenant,
				})),
		}),
		{
			name: 'tenant-storage',
		}
	)
)
