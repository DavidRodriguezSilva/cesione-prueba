export interface CesioneResponse {
	succeeded: boolean
	messages: string[]
	reasonCode: {
		value: number
		description: string
	}
}
