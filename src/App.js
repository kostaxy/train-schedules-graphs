import Table from 'antd/lib/table/Table';
import { Input, InputNumber, Popconfirm, Select, Switch, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { Point, Selection, VictoryTooltip, VictoryVoronoiContainer } from 'victory';
import { VictoryAxis, VictoryBar, VictoryGroup, VictoryScatter, VictoryTheme, VictoryZoomContainer } from 'victory';
import { VictoryChart, VictoryLine } from 'victory';
import cl from './App.module.css'


const App = () => {
    const [width, setWidth] = useState(window.innerWidth)
    const updateWidth = (ev) => {
        setWidth(ev.target.innerWidth)
    }


    const { Option } = Select;

    const [minutes, setMinutes] = useState([]);

    const setMinutesTicks = () => {
        let minutesTemp = []
        // for (let i = 0; i <= 24 * 60; i++) {
        for (let i = 0 * 60; i <= 24 * 60; i++) {
            if (i % 10 === 0) {
                minutesTemp.push(i)
            }
        }
        setMinutes([...minutesTemp])
    }
    const [selectedIdTrain, setSelectedIdTrain] = useState(-1)

    const getIndexOfGraphByIdTrain = (idTrain) => {
        // setDataTable()
        if (selectedIdTrain === -1) {
            return -1
        } else {
            let ind
            let i = 0
            for (i = 0; i < graphs.length; i++) {
                if (idTrain === graphs[i].id_train) {
                    ind = i;
                    break;
                }
            }
            return ind
        }
    }

    const clickGraph = (id_train) => {
        // console.log(graph)
        setSelectedIdTrain(id_train)

        // console.log(selectedIdTrain)
    }

    const [columns, setColumns] = useState([
        // {
        //     key: 'id_train',
        //     title: 'Поезд',
        //     dataIndex: 'id_train',
        // },
        {
            key: 'station',
            title: 'Станция',
            dataIndex: 'station',
        },
        {
            key: 'arrival',
            title: 'Прибытие',
            dataIndex: 'arrival',
        },
        {
            key: 'departure',
            title: 'Отправление',
            dataIndex: 'departure',
        }
    ]);

    const minutesToHours = (min) => {
        return (
            ('0' + Math.floor(min / 60)).slice(-2) +
            ':' +
            ('0' + Math.floor(min % 60)).slice(-2)
        )
    }

    const convertDataToTable = (graph) => {

        let map = new Map()

        let arx = []

        if (!graph) {
            return []
        }

        graph.dots.forEach(dot => {

            let flag = false
            let tempInd = -1
            let arxSort = arx.filter((e, index) => {
                tempInd = index
                return e.station === dot.y
            })
            if (arxSort.length > 0) {
                if (dot.action === 0) {
                    arx[tempInd] = { ...arx[tempInd], arrival: minutesToHours(dot.x) }
                } else {
                    arx[tempInd] = { ...arx[tempInd], departure: minutesToHours(dot.x) }
                }
            } else {
                if (dot.action === 0) {
                    arx.push({ id_train: graph.id_train, station: dot.y, arrival: minutesToHours(dot.x), departure: null })
                } else {
                    arx.push({ id_train: graph.id_train, station: dot.y, departure: minutesToHours(dot.x), arrival: null })
                }
            }
        })
        return (arx)
    }


    const [stations, setStations] = useState([
        'Орша', 'Толочин', 'Борисов', 'Степянка', 'Минск'
    ]);

    //action: 0 - прибытие, 1 - отправление

    const [graphs, setGraphs] = useState([
        {
            color: '#FF5733',
            id_train: 1,
            dots: [
                { action: 1, x: 552, y: 'Минск', index: 1 },
                { action: 0, x: 618, y: 'Степянка', index: 2 },
                { action: 1, x: 635, y: 'Степянка', index: 3 },
                { action: 0, x: 687, y: 'Борисов', index: 4 },
                { action: 1, x: 687, y: 'Борисов', index: 5 },
                { action: 0, x: 752, y: 'Толочин', index: 6 },
                { action: 1, x: 763, y: 'Толочин', index: 7 },
                { action: 0, x: 835, y: 'Орша', index: 8 },
            ]

        },
        {
            color: '#000',
            id_train: 2,
            dots: [
                { action: 1, x: 1091, y: 'Орша', index: 1 },
                { action: 0, x: 1111, y: 'Толочин', index: 2 },
                { action: 1, x: 1150, y: 'Толочин', index: 3 },
                { action: 0, x: 1170, y: 'Борисов', index: 4 },
                { action: 1, x: 1170, y: 'Борисов', index: 5 },
                { action: 0, x: 1200, y: 'Степянка', index: 6 },
                { action: 1, x: 1200, y: 'Степянка', index: 7 },
                { action: 0, x: 1234, y: 'Минск', index: 8 }
            ]

        }
    ]);

    const testArray = [1, 2, 3]
    const tickValues = minutes;

    // useEffect replaces `componentDidMount` and others
    useEffect(() => {
        window.addEventListener('resize', updateWidth)
        setMinutesTicks()

        // Removes listener on unmount
        return () => {
            window.removeEventListener('resize', updateWidth)
        }
    }, [])


    const [changingGraphMode, setChangingGraphMode] = useState(true);

    const changeMode = (checked) => {
        setChangingGraphMode(checked)
    }

    return <div className={cl.App__container}>
        <div className={cl.Graphs__container}>
            <VictoryChart
                padding={{ top: 30, bottom: 50, left: 100, right: 30 }}
                domainPadding={{ x: 0, y: [0, 5] }}
                // theme={VictoryTheme.material}
                // width={width}
                width={width}
                height={750}
            >
                <VictoryAxis crossAxis
                    // style={{
                    //     // grid: { stroke: "#718096", strokeDasharray: "2 10" },
                    //     // tickLabels: { fontSize: 8 }
                    // }}

                    // tickCount={24}
                    theme={VictoryTheme.material}
                    standalone={true}
                    tickValues={minutes}
                    tickFormat={el => el % 60 === 0 ? el / 60 : null}
                    style={{
                        grid: {
                            stroke: el => (el.tick % 60 === 0 ? "black" : "lightgrey"),
                            strokeWidth: 1.5,
                            strokeDasharray: el => ((el.tick % 30 === 0 && el.tick % 60 !== 0) ? "8 4" : "0")
                        }
                    }}
                />
                <VictoryAxis dependentAxis crossAxis
                    theme={VictoryTheme.material}
                    standalone={true}
                    tickValues={stations}
                    style={{
                        tickLabels: { fontSize: 20 },
                        grid: {
                            stroke: "lightgrey",
                            strokeDasharray: "1"
                        }
                    }}
                />
                {graphs.map((graph, index) =>
                    <VictoryGroup
                        className={cl.ChartGroup}
                        key={index}
                        data={graph.dots}
                    >
                        <VictoryLine
                            style={{ data: { stroke: graph.color } }}
                            sortKey="index"
                            events={[
                                {
                                    target: "data",
                                    eventHandlers: {
                                        onClick: () => (
                                            clickGraph(graph.id_train)
                                        ),
                                        onMouseDown: () => {
                                            clickGraph(graph.id_train)
                                        }
                                    }
                                }
                            ]}
                        />
                        <VictoryScatter
                            style={
                                { data: { fill: graph.color, id_train: graph.id_train } }
                            }

                            size={5}

                            events={[
                                {
                                    target: "data",
                                    eventHandlers: {
                                        onClick: () => (
                                            clickGraph(graph.id_train)
                                        ),
                                        onMouseDown: () =>
                                        (

                                            clickGraph(graph.id_train),
                                            {
                                                mutation: props => Object.assign(props, { dragging: true, size: 15 })
                                            }
                                        )
                                        ,
                                        onMouseMove: (evt, targetProps) => {
                                            const { scale } = targetProps;
                                            if (targetProps.dragging) {

                                                const { x, y } = Selection.getSVGEventCoordinates(evt); // use Victory's selection helper
                                                const point = { x_new: Math.round(scale.x.invert(x)) }

                                                let tempArr = [...graphs]
                                                var pos = tempArr.map(function (e) {
                                                    return e.id_train;
                                                }).indexOf(targetProps.style.id_train);


                                                // console.log(tempArr[pos].dots[targetProps.index])
                                                // targetProps.data[pos].
                                                let diff = (point.x_new - tempArr[pos].dots[targetProps.index].x)

                                                if (changingGraphMode) {
                                                    tempArr[pos].dots.map((el, index) => {
                                                        // console.log()
                                                        if (el.index > targetProps.index) {
                                                            console.log('1123123')
                                                            el.x = el.x + diff
                                                        }
                                                    })
                                                } else {
                                                    tempArr[pos].dots[targetProps.index] = { ...tempArr[pos].dots[targetProps.index], x: point.x_new }
                                                }

                                                setGraphs(tempArr)

                                                return (
                                                    {
                                                        target: "data",
                                                        mutation: props => Object.assign(props, { x })
                                                    })
                                            }
                                        },
                                        onMouseUp: () => (
                                            {
                                                mutation: props => Object.assign(props, { dragging: false, size: 5 })
                                            }
                                        ),
                                        onMouseLeave: () => ({
                                            mutation: props => Object.assign(props, { dragging: false, size: 5 })
                                        })
                                    }
                                }
                            ]}
                        />
                    </VictoryGroup>
                )}
            </VictoryChart>
        </div>

        <div>
            <div>
                <Select
                    style={{ width: 250 }}
                    // defaultValue="Номер поезда"
                    value={selectedIdTrain !== -1 ? selectedIdTrain : "Номер поезда"}
                    style={{ margin: '40px 10px 10px 10px' }}
                    onChange={(value) => setSelectedIdTrain(value)}
                >

                    {graphs.map((graph, index) => (
                        <Option key={index} value={graph.id_train}>Поезд № {graph.id_train}</Option>
                    ))
                    }

                </Select>
            </div>
            <div>
                <Table
                    locale={{ emptyText: 'Выберите поезд' }}
                    columns={columns}
                    pagination={false}
                    dataSource={convertDataToTable(graphs[getIndexOfGraphByIdTrain(selectedIdTrain)])}
                />
            </div>
            <div className={cl.Switch__container}>
                <span>Автоматическое перемещение последующих стоянок </span>
                <div className={cl.Switch}>
                    <Switch defaultChecked onChange={changeMode} />
                </div>
            </div>
        </div>

    </div >;
};

export default App;
