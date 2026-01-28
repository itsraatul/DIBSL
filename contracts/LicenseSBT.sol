// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * LicenseSBT
 * --------------------------------
 * Soulbound software license token
 * - Non-transferable
 * - No approvals
 * - Stores license state only
 *
 * NO execution logic
 * NO cryptographic keys
 */
contract LicenseSBT is ERC721, Ownable {

    struct LicenseData {
        uint256 productId;
        bool active;
        uint64 expiry;
        uint8 tier;
    }

    uint256 private _tokenIdCounter;
    mapping(uint256 => LicenseData) private _licenses;

    event LicenseIssued(
        uint256 indexed tokenId,
        address indexed to,
        uint256 productId,
        uint64 expiry,
        uint8 tier
    );

    event LicenseRevoked(uint256 indexed tokenId);

    constructor()
        ERC721("DIBSL Software License", "DIBSL-LIC")
        Ownable(msg.sender)
    {}

    /* =========================================================
       Vendor Actions
       ========================================================= */

    function issueLicense(
        address to,
        uint256 productId,
        uint64 expiry,
        uint8 tier
    ) external onlyOwner returns (uint256) {
        require(to != address(0), "Invalid recipient");

        uint256 tokenId = ++_tokenIdCounter;
        _safeMint(to, tokenId);

        _licenses[tokenId] = LicenseData({
            productId: productId,
            active: true,
            expiry: expiry,
            tier: tier
        });

        emit LicenseIssued(tokenId, to, productId, expiry, tier);
        return tokenId;
    }

    function revokeLicense(uint256 tokenId) external onlyOwner {
        require(_ownerOf(tokenId) != address(0), "License does not exist");
        _licenses[tokenId].active = false;
        emit LicenseRevoked(tokenId);
    }

    /* =========================================================
       Read-Only License Query
       ========================================================= */

    function getLicense(uint256 tokenId)
        external
        view
        returns (
            uint256 productId,
            bool active,
            uint64 expiry,
            uint8 tier,
            address owner,
            bool valid
        )
    {
        address licOwner = _ownerOf(tokenId);
        require(licOwner != address(0), "License does not exist");

        LicenseData memory lic = _licenses[tokenId];
        bool expired = block.timestamp > lic.expiry;

        return (
            lic.productId,
            lic.active,
            lic.expiry,
            lic.tier,
            licOwner,
            lic.active && !expired
        );
    }

    /* =========================================================
       Soulbound Enforcement (OpenZeppelin v5-correct)
       ========================================================= */

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns (address) {
        address from = _ownerOf(tokenId);

        // allow minting only
        if (from != address(0) && to != address(0)) {
            revert("SBT: non-transferable");
        }

        return super._update(to, tokenId, auth);
    }

    function approve(address, uint256) public pure override {
        revert("SBT: approvals disabled");
    }

    function setApprovalForAll(address, bool) public pure override {
        revert("SBT: approvals disabled");
    }
}
