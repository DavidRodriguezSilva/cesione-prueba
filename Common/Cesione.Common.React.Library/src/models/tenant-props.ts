import { CesioneResponse } from "./cesione-response"

/**
 * Representa la informacion de un tenant y sus propiedades
 */
interface ITenantProps {
	isActive: boolean
	uuid: string
	alias: string
	name: string
	icon: string
	lightLogo: string
	darkLogo: string
	estilos: string
}

interface ITenantPropsResponse extends CesioneResponse {
  tenantProps: ITenantProps
}

export type { ITenantProps, ITenantPropsResponse }
