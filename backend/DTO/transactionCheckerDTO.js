class TransactionCheckerDTO{
  constructor({
    vehicle_id,
    entry_vehicle_no,
    entry_station_id,
    entry_datetime,
    entry_trans_type,
    exit_vehicle_no,
    exit_station_id,
    exit_datetime,
    exit_trans_type,
    parked_time,
    parking_fee,
    payment_card,
  }) {
    this.vehicleId = vehicle_id;
    this.entryVehicleNo = entry_vehicle_no;
    this.entryStationId = entry_station_id;
    this.entryDatetime = entry_datetime;
    this.entryTransType = entry_trans_type;
    this.exitVehicleNo = exit_vehicle_no ?? null;
    this.exitStationId = exit_station_id ?? null;
    this.exitDatetime = exit_datetime ?? null;
    this.exitTransType = exit_trans_type ?? null;
    this.parkedTime = parked_time ?? null;
    this.parkingFee = parking_fee ?? null;
    this.paymentCard = payment_card ?? null;
  }
}

module.exports = TransactionCheckerDTO;