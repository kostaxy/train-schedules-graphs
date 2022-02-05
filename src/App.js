import Table from 'antd/lib/table/Table';
import React, { useEffect, useState } from 'react';
import { Point, Selection } from 'victory';
import { VictoryAxis, VictoryBar, VictoryGroup, VictoryScatter, VictoryTheme, VictoryZoomContainer } from 'victory';
import { VictoryChart, VictoryLine } from 'victory';
import cl from './App.module.css'


const App = () => {
    const [width, setWidth] = useState(window.innerWidth)
    const updateWidth = (ev) => {
        setWidth(ev.target.innerWidth)
    }

    const [minutes, setMinutes] = useState([]);

    const setMinutesTicks = () => {
        let minutesTemp = []
        for (let i = 0; i <= 24 * 60; i++) {
            if (i % 15 === 0) {
                minutesTemp.push(i)
            }

        }
        setMinutes([...minutesTemp])
    }

    const [columns, setColumns] = useState([
        {
            key: 'id_train',
            title: 'Поезд',
            dataIndex: 'id_train',
        },
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
                { action: 1, x: 552, y: 'Минск', index: 8 },
                { action: 1, x: 635, y: 'Степянка', index: 6 },
                { action: 0, x: 618, y: 'Степянка', index: 7 },
                { action: 0, x: 687, y: 'Борисов', index: 5 },
                { action: 1, x: 687, y: 'Борисов', index: 4 },
                { action: 0, x: 752, y: 'Толочин', index: 3 },
                { action: 1, x: 763, y: 'Толочин', index: 2 },
                { action: 0, x: 835, y: 'Орша', index: 1 },
            ]

        },
        {
            color: 'brown',
            id_train: 2,
            dots: [
                { action: 1, x: 1091, y: 'Орша', index: 1 },
                { action: 0, x: 1111, y: 'Толочин', index: 2 },
                { action: 1, x: 1150, y: 'Толочин', index: 3 },
                { action: 0, x: 1234, y: 'Минск', index: 4 }
            ]

        },
        {
            color: '#3336FF',
            id_train: 3,
            dots: [
                { action: 1, x: 500, y: 'Минск', index: 4 },
                { action: 0, x: 550, y: 'Борисов', index: 3 },
                { action: 0, x: 550, y: 'Борисов', index: 3 },
                { action: 0, x: 600, y: 'Орша', index: 1 },
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

    return <div>
        <div className={cl.Graphs__container}>

            <VictoryChart
                padding={{ top: 30, bottom: 50, left: 100, right: 30 }}
                domainPadding={{ x: 0, y: [0, 5] }}
                // theme={VictoryTheme.material}
                width={width}
                height={750}
            // containerComponent={
            //     <VictoryZoomContainer />
            // }
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
                            stroke: el => (el.tick % 30 === 0 ? "black" : "lightgrey"),
                            strokeDasharray: el => (el.tick % 30 === 0 ? "8 4" : "1")
                        }
                    }}
                />
                <VictoryAxis dependentAxis crossAxis
                    theme={VictoryTheme.material}
                    standalone={true}
                    tickValues={stations}
                    style={{
                        grid: {
                            stroke: "lightgrey",
                            strokeDasharray: "1"
                        }
                    }}
                />

                {graphs.map((graph, index) =>
                    <VictoryGroup
                        key={Date.now()}
                        data={graph.dots}
                    >
                        <VictoryLine
                            style={{ data: { stroke: graph.color } }}
                            sortKey="index"
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
                                        onMouseDown: () => ({
                                            mutation: props => Object.assign(props, { dragging: true, size: 10 })
                                        }),
                                        onMouseMove: (evt, targetProps) => {
                                            const { scale } = targetProps;
                                            if (targetProps.dragging) {

                                                const { x, y } = Selection.getSVGEventCoordinates(evt); // use Victory's selection helper
                                                const point = { x_new: Math.round(scale.x.invert(x)) }

                                                let tempArr = [...graphs]
                                                var pos = tempArr.map(function (e) {
                                                    return e.id_train;
                                                }).indexOf(targetProps.style.id_train);

                                                tempArr[pos].dots[targetProps.index] = { ...tempArr[pos].dots[targetProps.index], x: point.x_new }

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


        {graphs.map((graph, index) => (
            // convertDataToTable(graph),
            <Table
                key={index}
                columns={columns}
                dataSource={convertDataToTable(graph)}
            ></Table>
        ))
        }

    </div >;
};

export default App;
