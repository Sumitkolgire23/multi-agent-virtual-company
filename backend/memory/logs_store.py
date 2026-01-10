from typing import List
from ..api.schemas import LogEntry

class LogsStore:
    def __init__(self):
        self._logs: List[LogEntry] = []

    def add_log(self, log: LogEntry):
        self._logs.append(log)

    def get_logs(self, limit: int = 100) -> List[LogEntry]:
        return sorted(self._logs, key=lambda x: x.timestamp, reverse=True)[:limit]

    def clear(self):
        self._logs = []

logs_store = LogsStore()
