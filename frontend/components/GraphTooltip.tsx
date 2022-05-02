import { splitAmountFormatter, longMonthFormatter } from "../utils/Formatters";
import styles from '../styles/GraphTooltip.module.css'

const CustomTooltip = ({ active, payload, label }: any) => {
  let isPrognosis = true
  let showItem = false
  let payloadValues: { name: string; value: string | number; color: string;}[] = []
  
  if (active && payload && payload.length) {
    /* Payload format:
    0: {name: 'Usikkerhet', value: Array(2)}
    1: {name: 'Total usikkerhet', value: Array(2)}
    2: {name: 'Fjorårets Regnskap', value: '2 988 368'}
    3: {name: 'Fjorårets Totalregnskap', value: '8 420 908'}
    4: {name: 'Regnskap', value: '2 988 368'}
    5: {name: 'Totalregnskap', value: '8 420 908'}
    6: {name: 'Regnskapsprognose', value: '2 988 368'}
    7: {name: 'Total regnskapsprognose', value: '8 420 908'}
    8: {name: 'Budsjett', value: '30 476 000'}
   */
   payload.forEach( (item: { name: string; value: number; color: string;}) => {

    // Check if it is an overlap between prognosis and actual data
    // If there is an overlap, only show actual data and not prognosis
    switch(item.name){
      case "Fjorårets Regnskap":
      case "Fjorårets Totalregnskap":
      case "Budsjett":
        showItem = true
        break;
      case "Regnskap":
      case "Totalregnskap":
        showItem = true
        isPrognosis = false
        break;
      case "Regnskapsprognose":
      case "Total regnskapsprognose":
        if(isPrognosis){
          showItem = true
        } else{
          showItem = false
        }
        break;
      default:
        showItem = false
    }
    
    let itemObject = {
      "name": item.name,
      "value": splitAmountFormatter(item.value), 
      "color": item.color,
    }
    if (showItem){
      payloadValues.push(itemObject)
    }
   })
   
   payloadValues.reverse()
    return (
      <div className={styles.tooltip}>
        <p className={styles.header}>{`${longMonthFormatter(label)}`}</p>
        {payloadValues.map((item) => {
          return <p key={item.name} className={styles.value} style={{color: item.color}}>{`${item.name}:`} <span className={styles.number}>{`${item.value} kr`}</span></p>
        })}
      </div>
    );
  }
  return null;
};
export default CustomTooltip