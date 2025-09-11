class parkingLotDTO {
    constructor({zone, type, allocated, occupied}) {
        this.zone = zone;
        this.type = type;
        this.allocated = allocated;
        this.occupied = occupied;
    }
}

module.exports = parkingLotDTO;