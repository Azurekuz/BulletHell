function Number_Format(format){
    this.format = format;
}

Number_Format.prototype.adhere = function(toFormat){
    return (this.format.substr(0, (this.format.length - toFormat.length)) + toFormat);
}