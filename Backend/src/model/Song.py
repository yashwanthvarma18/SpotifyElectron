import json
from dataclasses import dataclass

from model.Genre import Genre


@dataclass
class Song:
    name: str
    artist: str
    photo: str
    duration: int  # In seconds
    genre: Genre
    url: str
    number_of_plays: int

    def get_json(self) -> str:
        song_json = json.dumps(self.__dict__)
        return song_json