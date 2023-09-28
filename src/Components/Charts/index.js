import React from 'react'
import { Line, Pie } from '@ant-design/charts';
import { Transaction } from 'firebase/firestore';

function ChartsComponent({ sortedTransactions }) {

    const data = sortedTransactions.map((item)=>{
      return {date: item.date, amount: item.amount};
    });

    const spendingData = sortedTransactions.filter((transaction)=>{
      if(transaction.type == "expense" ){
        return { tag: transaction.tag, amount: transaction.amount };
      }
    })
    
    let finalSpendings = spendingData.reduce((acc, obj)=>{
      let key = obj.tag;
      if(!acc[key]){
        acc[key]={tag: obj.tag, amount: obj.amount};  // create a new object with the same properties
      }
      else{
        acc[key].amount+=obj.amount;
      }
      return acc;
    }, {});


      const config = {
        data: data,
        width: 500,
        autoFit: true,
        xField: 'date',
        yField: 'amount',
      };

      const spendingConfig = {
        data: Object.values(finalSpendings),
        width: 500,
        angleField: "amount",
        colorField: "tag",
      };

    let chart;
    let pieChart;

  return (
    <div className='charts-wrapper'>
      <div>
        <h2>Financial Statistics</h2>
        <Line {...config} onReady={(chartInstance) => (chart = chartInstance)} />   {/* <Line> Component: This is the component responsible for rendering a line chart. It is typically part of a charting library and allows you to create line charts with various configurations and data. */}

      </div>
      <div>
        <h2>Total Spendings</h2>
        <Pie {...spendingConfig} onReady={(chartInstance) => (pieChart = chartInstance)}/>
      </div>
    </div>
  )
}

export default ChartsComponent;