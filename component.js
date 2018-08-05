function convertHTML(){

}


(function(){

class recTable extends HTMLElement {

    constructor(){

        super();

        //Create the shadow dom
        this.shadow = this.attachShadow({ mode: 'open' });
        
        this.container = document.createElement("div");
        this.container.classList.add("tableContainer");
        this.generateTotal();
        this.shadow.appendChild(this.container);
    }

    generateTotal(){
        //put all table data values into array
        const tableArray = this.getTableInfo();

        //the column to calculate the prices
        const colToCalculate = this.calculateColumn(this.colName);

        //total cost of all products
        var cost = this.getTotalCost(tableArray, colToCalculate);
        
        //amount of tax 
        var tax = this.calculateTax(cost, this.taxPercentage);

        //total + tax
        var finalCost = this.calculateTaxTotal(cost, tax)

        //display the table + calculations
        this.displayTable(tableArray, cost, tax, finalCost);
    }

    displayTable(tableArray, cost, tax, finalCost){
        let shadowTable = document.createElement("table");
        shadowTable.classList.add("table");
        //shadowTable.innerHTML = tableArray;
        var htmlstring = ''

        for(let i = 0; i < tableArray.length; i+=4){
            htmlstring += `
            <tr>
            <td>${tableArray[i]}</td>
            <td>${tableArray[i+1]}</td>
            <td>${tableArray[i+2]}</td>
            <td>${tableArray[i+3]}</td>
            </tr>`;
        }
        
        htmlstring += `
        <tr>
        <td></td>
        <td></td>
        <td>Sub Total</td>
        <td>${cost}</td>
        </tr>
        <tr>
        <td></td>
        <td></td>
        <td>Tax</td>
        <td>${tax}</td>
        </tr>
        <tr>
        <td></td>
        <td></td>
        <td>Total</td>
        <td>${finalCost}</td>
        </tr>`;
        
        shadowTable.innerHTML = htmlstring

        this.container.appendChild(shadowTable);
    }

    getTableInfo(){
        let inputTable = this.querySelectorAll('td');

        let tdArray = [];
        for(let i = 0; i < inputTable.length; i++){
            tdArray.push(inputTable[i].innerHTML);
        }
        return tdArray;
    }
    
    getTableHeader(){
        let inputTableHeader = this.querySelectorAll('th');
        let thArray = [];
        for(let i = 0; i < inputTableHeader.length; i++){
            thArray.push(inputTableHeader[i].innerHTML);
        }
        return thArray;
    }

    getTotalCost(inputTable, colToCalculate){
        let cost = 0;
        for(let i = 0; i < inputTable.length; i++){
            if(i % 4 == colToCalculate){
                cost += parseFloat(inputTable[i]);
            }
        }
        return cost;
    }

    calculateColumn(col){
        let inputTableHeader = this.getTableHeader();
        let colNum = 3; //default is the 4th column
        for(let i = 0; i < inputTableHeader.length; i++){
            if(col == inputTableHeader[i])
                colNum = i;
        }
        return colNum;
    }

    calculateTax(total, tax){
        return total * tax;
    }

    calculateTaxTotal(total, tax){
        return total + tax;
    }

    //get attributes of tax
    get taxPercentage(){
        return this.getAttribute("tax") || "0.00";
    }
    get colName(){
        return this.getAttribute("col") || "cost";
    }
}
customElements.define('receipt-table', recTable);
})(); 