class SeasonCheckerDTO {
    constructor({
        SeasonNo,
        VehicleNo,
        SeasonStatus,
        ValidDate,
        ExpireDate,
    }) {
        this.seasonNo = SeasonNo;
        this.vehicleNo = VehicleNo;
        this.seasonStatus = SeasonStatus;
        this.validDate = ValidDate;
        this.expireDate = ExpireDate;
    }
}

module.exports = SeasonCheckerDTO;