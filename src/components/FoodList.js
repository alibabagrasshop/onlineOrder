import React, {useEffect, useState} from 'react'
import {Select, List, Card, Tooltip, Button, message} from 'antd';
import {getRestaurants, getMenus, addItemToCart} from "../utils";
import { PlusOutlined } from "@ant-design/icons";
//import [foodData, setFoodData] = useState([]);

const { Option} = Select;
const AddToCartButton = ({ itemId}) => {

    const [loading, setLoading] = useState(false);
    const addToCart = () => {
        setLoading(false);
        addItemToCart(itemId)
            .then( () => {
                message.success("Successfully add item")
            })
            .catch( err => {
                message.error(err.message)
            })
            .finally(  () => {
                setLoading(false);
        })
    }

    return (
        <Tooltip title = "Add to shopping cart">
            <Button icon = {<PlusOutlined />}
                    type = "primary"
                    loading = {loading}
                    onClick = {addToCart}
            />
        </Tooltip>
    )

}

const FoodList= () => {
    const [loading, setLoading] = useState(false);
    const [curRest, setCurRest] = useState();
    const [restaurants, setRestaurants] = useState([]);
    const [foodData, setFoodData] = useState([]);
    const [loadingRest, setLoadingRest] = useState(false);

    useEffect( () => {
        //
        setLoadingRest(true);
        getRestaurants()
            .then( resData => {
                console.log('res -> ', resData)
                setRestaurants(resData);
            })
            .catch( err => {
                console.log(err.message);
            })
            .finally( () => {
                setLoadingRest(false);
            })
    }, []);
    useEffect( () => {
        // set loading status -> true
        // get menu from the server
        // case1: success, setState
        if(!curRest) return;
        setLoading(true);
        getMenus(curRest)
            .then(Data => {
                console.log('menu ->', Data);
                setFoodData(Data);
            })
            .catch( err => {
                console.log(err.message);
            })
            .finally( () => {
                setLoading(false);
            })

    }, [curRest])

        return (
            <div>
                <Select value = {curRest}
                        placeholder = "Select a restaurant"
                        style= {{ width: 300}}
                    onSelect = { value => setCurRest(value)}

                        loading={loadingRest}

                        onChange={() => {}}

                >

                    {
                        restaurants.map (item => {
                            console.log(item)
                            return <Option key={item.id} value={item.id} > {item.name}</Option>
                        })
                    }
                </Select>
                {
                    curRest
                    &&
                        <List
                            style={{ marginTop: 20 }}
                            loading={loading}
                            grid={{
                                gutter: 16,
                                xs: 1,
                                sm: 2,
                                md: 4,
                                lg: 4,
                                xl: 3,
                                xxl: 3,
                            }}
                            dataSource = {foodData}
                            renderItem = { item => (
                                <List.Item>
                                    <Card title = {item.name}
                                          extra={< AddToCartButton itemId = {item.id} />}
                                          >
                                        <img src={item.imageUrl}
                                             alt = {item.name}
                                             style = {{height: "auto",
                                                 width: "100%",
                                                 display: "block"
                                             }}
                                        />
                                        { `price: ${item.price}`}
                                    </Card>
                                </List.Item>

                                )}

                        />
                }

            </div>
       )
}

export default FoodList;