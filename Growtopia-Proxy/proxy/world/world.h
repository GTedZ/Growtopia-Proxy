#pragma once
#include <string>
#include <vector>
#include "player.h"

class World {
   public:
    std::string name{};
    std::vector<Player> players{};
    Player local{};
    bool connected{};
};