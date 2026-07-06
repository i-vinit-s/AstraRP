const onlineStaff = new Map();

function add(socketId, user) {
  onlineStaff.set(socketId, {
    ...user,
    socketId,
    connectedAt: new Date(),
  });
}

function remove(socketId) {
  onlineStaff.delete(socketId);
}

function getAll() {
  return [...onlineStaff.values()];
}

module.exports = {
  add,
  remove,
  getAll,
};
