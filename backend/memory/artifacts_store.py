from typing import List, Optional
from ..api.schemas import Artifact

class ArtifactsStore:
    def __init__(self):
        self._artifacts: List[Artifact] = []

    def add_artifact(self, artifact: Artifact):
        self._artifacts.append(artifact)

    def get_artifacts(self) -> List[Artifact]:
        return self._artifacts

    def get_artifact_by_id(self, artifact_id: str) -> Optional[Artifact]:
        for artifact in self._artifacts:
            if artifact.id == artifact_id:
                return artifact
        return None

    def clear(self):
        self._artifacts = []

artifacts_store = ArtifactsStore()
