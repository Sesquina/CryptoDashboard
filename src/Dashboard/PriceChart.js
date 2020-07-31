import React from 'react'
import ReactHighcharts from 'react-highcharts'
import highChartsConfig from './HighChartsConfig'
import { AppContext } from '../App/AppProvider'
import { Tile } from '../Shared/Tile'
import HighChartsTheme from './HighChartsTheme'
import ChartSelect from './ChartSelect'

ReactHighcharts.Highcharts.setOptions(HighChartsTheme);

export default function () {
    return (
        <AppContext.Consumer>
            {({ historicalData, chartSelectionHandler }) => //The chart should be returned through a callback fn()
                <Tile>
                    <ChartSelect
                        defaultValue="months"
                        onChange={e => chartSelectionHandler(e.target.value)}
                    >
                        <option value="days">Days</option>
                        <option value="weeks">Weeks</option>
                        <option value="months">Months</option>
                    </ChartSelect>
                    {historicalData ?
                        <ReactHighcharts config={highChartsConfig(historicalData)} />
                        :
                        <div>Loading Historical Data</div>
                    }
                </Tile>
            }
        </AppContext.Consumer>
    )
}