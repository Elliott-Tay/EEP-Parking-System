class entryStationDTO {
    constructor({
        Station,
        Time,
        VehicleNo,
        Status,
    }) {
        this.station = Station;
        this.time = Time ? new Date(Time).toLocaleString('en-SG', { hour12: false }) : null;
        this.vehicleNo = VehicleNo;
        this.status = Status;
    }
}

module.exports = entryStationDTO;