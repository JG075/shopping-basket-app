import Discount from "../models/Discount"
import Product from "../models/Product"

export interface SuccessResponse {
    data: Product[]
}

interface RejectResponse {
    error: {
        status: number
        message: string
    }
}

const MOCK_RESPONSE = {
    data: [
        {
            id: 1,
            name: "Face Mask",
            thumbnail: "/facemask.jpg",
            cost: 2.5,
            discounts: [
                {
                    qtyRequirement: 2,
                    amount: 1,
                    text: "Two Face Masks for £4",
                },
            ],
        },
        {
            id: 2,
            name: "Toilet Roll",
            thumbnail: "/toiletroll.jpg",
            cost: 0.65,
            discounts: [
                {
                    qtyRequirement: 6,
                    amount: 0.65,
                    text: "Six rolls of toilet paper for the price of five",
                },
            ],
        },
    ],
}

const get = () => {
    return new Promise(
        (
            success: (arg: SuccessResponse) => void,
            // @ts-ignore
            reject: (arg: RejectResponse) => void
        ) => {
            setTimeout(() => {
                const parsedReponse = MOCK_RESPONSE.data.map((p) => {
                    const discounts = p.discounts.map((d) => new Discount(d))
                    return new Product({ ...p, discounts })
                })
                success({ data: parsedReponse })
            }, 1000)
        }
    )
}

const api = {
    get,
}

export default api
