'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.ReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output':{}});
const map = new Map(); //key: 都道府県 value: 集計データのオブジェクト
rl.on('line', (lineString) => {
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[2];
    const popu = parseInt(columns[7]);
    if (year === 2020 || year === 2025){
        let value = map.get(prefecture);
        if(!value){
            value = {
                popu20: 0,
                popu25: 0,
                change: null
            };
        }
    if(year === 2020){
        value.popu20 += popu;
        }
    if(year === 2025){
        value.popu25 += popu;
        }
       map.set(prefecture,value);
    }
});
rl.resume();
rl.on('close',() => {
    for(let pair of map){
        const value = pair[1];
        value.change = value.popu25 / value.popu20 ;
    }
    const rankingArray = Array.from(map).sort((pair1,pair2) => {
        return pair1[1].change - pair2[1].change;
    });
    const rankingStrings = rankingArray.map((pair,i) => {
        return (i + 1)+ '位 ' + pair[0] + ': ' + pair[1].popu20 + '=>' + pair[1].popu25 + ' 変化率:' + pair[1].change;
    });
    console.log(rankingStrings);
});
