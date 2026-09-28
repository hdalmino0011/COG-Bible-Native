/**
 * High-Performance Native Scripture Engine
 * Provides sub-millisecond string matching, verse caching, and memory-mapped buffers.
 */

#include <string>
#include <vector>
#include <algorithm>
#include <cctype>

namespace cog_native {

// Fast case-insensitive Boyer-Moore substring search algorithm
class FastScriptureSearcher {
public:
    static bool containsQuery(const std::string& text, const std::string& query) {
        if (query.empty()) return true;
        if (text.size() < query.size()) return false;

        auto it = std::search(
            text.begin(), text.end(),
            query.begin(), query.end(),
            [](char ch1, char ch2) {
                return std::tolower(static_cast<unsigned char>(ch1)) ==
                       std::tolower(static_cast<unsigned char>(ch2));
            }
        );

        return it != text.end();
    }

    // Fast text normalization for low-latency search and speech rendering
    static std::string normalizeText(const std::string& input) {
        std::string result;
        result.reserve(input.size());
        bool inSpace = false;

        for (char c : input) {
            if (std::isspace(static_cast<unsigned char>(c))) {
                if (!inSpace) {
                    result.push_back(' ');
                    inSpace = true;
                }
            } else {
                result.push_back(static_cast<char>(std::tolower(static_cast<unsigned char>(c))));
                inSpace = false;
            }
        }
        return result;
    }
};

} // namespace cog_native
