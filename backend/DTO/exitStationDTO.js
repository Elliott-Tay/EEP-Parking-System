class exitStationDTO {
    constructor({
        Station,
        Time,
        VehicleNo,
        PaymentCardNo,
        Fee,
        Balance,
        Status
    }) {
        this.station = Station;
        this.time = Time ? new Date(Time).toLocaleString('en-SG', { hour12: false }) : null;
        this.vehicleNo = VehicleNo;
        this.paymentCardNo = PaymentCardNo;
        this.fee = Fee;
        this.balance = Balance;
        this.status = Status;
    }
}

module.export = exitStationDTO;