import type { NextPage } from "next"
import Head from "next/head"
import { useEffect, useState } from "react"
import productAPI, { SuccessResponse } from "../api/product"
import ProductList from "../components/index/ProductList"
import ShoppingBasket from "../components/index/ShoppingBasket"
import SubHeading from "../components/index/SubHeading"

import styles from "../styles/Home.module.css"

const Home: NextPage = () => {
    const [error, setError] = useState(false)
    const [data, setData] = useState<SuccessResponse["data"]>()

    const fetchData = async () => {
        try {
            const res = await productAPI.get()
            setData(res.data)
        } catch (error) {
            setError(true)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const renderProducts = () => {
        if (error) return <p>Error!</p>
        if (!data) return <p>Loading...</p>
        return <ProductList products={data} />
    }

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
                    <ShoppingBasket />
                </section>
            </main>
        </div>
    )
}

export default Home
