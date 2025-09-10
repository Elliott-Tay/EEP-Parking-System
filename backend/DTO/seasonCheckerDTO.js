class SeasonCheckerDTO {
    constructor({
        season_no,
        vehicle_no,
        season_status,
        valid_date,
        expire_date,
        price,
    }) {
        this.seasonNo = season_no;
        this.vehicleNo = vehicle_no;
        this.seasonStatus = season_status;
        this.validDate = valid_date;
        this.expireDate = expire_date;
        this.price = price;         
  }
}

module.exports = SeasonCheckerDTO;