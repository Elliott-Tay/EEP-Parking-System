class MovementDTO {
  constructor({
    log_id,
    vehicle_id,
    entry_trans_type,
    entry_station_id,
    entry_datetime,
    entry_datetime_detect,
    exit_trans_type,
    exit_station_id,
    exit_datetime,
    exit_datetime_detect,
    parking_dur,
    parking_charges,
    paid_amount,
    card_type,
    card_number,
    vehicle_number,
    ticket_type,
    ticket_id,
    update_datetime,
    receipt_bit,
  }) {
    this.logId = log_id;
    this.vehicleId = vehicle_id;
    this.entryTransType = entry_trans_type;
    this.entryStationId = entry_station_id;

    // Format entry datetime
    this.entryDatetime = entry_datetime
      ? new Date(entry_datetime).toLocaleString('en-SG', { hour12: false })
      : null;

    // Format entry datetime detected
    this.entryDatetimeDetect = entry_datetime_detect
      ? new Date(entry_datetime_detect).toLocaleString('en-SG', { hour12: false })
      : null;

    this.exitTransType = exit_trans_type ?? null;
    this.exitStationId = exit_station_id ?? null;

    // Format exit datetime
    this.exitDatetime = exit_datetime
      ? new Date(exit_datetime).toLocaleString('en-SG', { hour12: false })
      : null;

    // Format exit datetime detected
    this.exitDatetimeDetect = exit_datetime_detect
      ? new Date(exit_datetime_detect).toLocaleString('en-SG', { hour12: false })
      : null;

    this.parkingDuration = parking_dur ?? null;
    this.parkingCharges = parking_charges ?? null;
    this.paidAmount = paid_amount ?? null;
    this.cardType = card_type ?? null;
    this.cardNumber = card_number ?? null;
    this.vehicleNumber = vehicle_number ?? null;
    this.ticketType = ticket_type ?? null;
    this.ticketId = ticket_id ?? null;

    // Format update datetime
    this.updateDatetime = update_datetime
      ? new Date(update_datetime).toLocaleString('en-SG', { hour12: false })
      : null;

    this.receiptBit = receipt_bit ?? null;
  }
}

module.exports = MovementDTO;
