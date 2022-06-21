import type { NextPage } from "next"
import Head from "next/head"
import { useEffect } from "react"
import { useImmer } from "use-immer"
import pick from "lodash/pick"

import productAPI, { SuccessResponse } from "../api/product"
import ProductList from "../components/index/ProductList"
import ShoppingBasket from "../components/index/ShoppingBasket"
import SubHeading from "../components/index/SubHeading"
import Basket from "../models/Basket"

import styles from "../styles/Home.module.css"

const Home: NextPage = () => {
    const [error, setError] = useImmer(false)
    const [products, setProducts] = useImmer<SuccessResponse["data"] | null>(
        null
    )
    const [basket, setBasket] = useImmer(new Basket())

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await productAPI.get()
                setProducts(res.data)
            } catch (error) {
                setError(true)
            }
        }

        fetchData()
    }, [setError, setProducts])

    const handleOnChange = (id: number, qty: number) => {
        setBasket((basket) => {
            const product = products!.find((p) => p.id === id)
            if (product) {
                basket.addItem(product, qty)
            }
        })
    }

    const renderProducts = () => {
        if (error) return <p>Error!</p>
        if (!products) return <p>Loading...</p>

        const productList = products.map((p) => {
            return pick(p, ["id", "name", "thumbnail", "cost"])
        })
        return <ProductList products={productList} onChange={handleOnChange} />
    }

    const basketItems = basket.items.map(({ qty, product }) => {
        return { qty, ...pick(product, ["id", "name", "cost"]) }
    })

    return (
        <div className={styles.container}>
            <Head>
                <title>Nextjs Shopping Cart</title>
                <meta name="description" content="A next shopping cart app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <h1>Nextjs Shopping Cart</h1>
                <section data-id="products">
                    <SubHeading name="Products" />
                    {renderProducts()}
                </section>
                <section>
                    <SubHeading name="Basket" />
                    <ShoppingBasket items={basketItems} />
                </section>
            </main>
        </div>
    )
}

export default Home
