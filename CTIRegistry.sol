// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CTIRegistry {

    // ─── Structs ───────────────────────────────────────────
    struct IoC {
        string  iocType;
        string  value;
        string  threatType;
        uint8   severity;
        address contributor;
        uint256 timestamp;
        bool    isActive;
        uint256 upvotes;
        uint256 downvotes;
        string  tlpLevel;
    }

    struct Member {
        address addr;
        string  orgName;
        bool    isActive;
        uint256 reputationScore;
        uint256 iocCount;
        uint256 joinedAt;
    }

    // ─── State Variables ───────────────────────────────────
    address public admin;
    uint256 public iocCounter;

    mapping(uint256 => IoC)     public iocs;
    mapping(address => Member)  public members;
    mapping(string  => uint256) public iocValueToId;
    mapping(address => bool)    public consortiumMembers;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    address[] public memberList;

    // ─── Events ────────────────────────────────────────────
    event IoCSubmitted(uint256 indexed id, string iocType, string value, address contributor);
    event IoCVoted(uint256 indexed id, address voter, bool upvote);
    event MemberAdded(address member, string orgName);
    event MemberRevoked(address member);
    event ReputationUpdated(address member, uint256 newScore);

    // ─── Modifiers ─────────────────────────────────────────
    modifier onlyAdmin()  { require(msg.sender == admin, "Not admin"); _; }
    modifier onlyMember() { require(consortiumMembers[msg.sender], "Not a consortium member"); _; }

    constructor() {
        admin = msg.sender;
        _addMember(msg.sender, "AdminOrg");
    }

    // ─── Member Management ─────────────────────────────────
    function addMember(address _addr, string memory _orgName) public onlyAdmin {
        _addMember(_addr, _orgName);
    }

    function _addMember(address _addr, string memory _orgName) internal {
        consortiumMembers[_addr] = true;
        members[_addr] = Member(_addr, _orgName, true, 100, 0, block.timestamp);
        memberList.push(_addr);
        emit MemberAdded(_addr, _orgName);
    }

    function revokeMember(address _addr) public onlyAdmin {
        consortiumMembers[_addr] = false;
        members[_addr].isActive  = false;
        emit MemberRevoked(_addr);
    }

    // ─── IoC Submission ────────────────────────────────────
    function submitIoC(
        string memory _iocType,
        string memory _value,
        string memory _threatType,
        uint8         _severity,
        string memory _tlpLevel
    ) public onlyMember returns (uint256) {
        require(_severity >= 1 && _severity <= 10, "Severity must be 1-10");
        require(iocValueToId[_value] == 0, "IoC already exists");

        iocCounter++;
        iocs[iocCounter] = IoC(
            _iocType, _value, _threatType,
            _severity, msg.sender,
            block.timestamp, true, 0, 0, _tlpLevel
        );
        iocValueToId[_value] = iocCounter;

        members[msg.sender].iocCount++;
        _increaseReputation(msg.sender, 10);   // +10 for submission

        emit IoCSubmitted(iocCounter, _iocType, _value, msg.sender);
        return iocCounter;
    }

    // ─── Voting / Verification ─────────────────────────────
    function voteOnIoC(uint256 _id, bool _upvote) public onlyMember {
        require(_id <= iocCounter && _id > 0, "Invalid IoC ID");
        require(!hasVoted[_id][msg.sender], "Already voted");
        require(iocs[_id].contributor != msg.sender, "Cannot vote own IoC");

        hasVoted[_id][msg.sender] = true;

        if (_upvote) {
            iocs[_id].upvotes++;
            _increaseReputation(iocs[_id].contributor, 5);   // +5 for upvote received
        } else {
            iocs[_id].downvotes++;
            _decreaseReputation(iocs[_id].contributor, 3);   // -3 for downvote received
            if (iocs[_id].downvotes > iocs[_id].upvotes + 5) {
                iocs[_id].isActive = false;
            }
        }
        emit IoCVoted(_id, msg.sender, _upvote);
    }

    // ─── Reputation Engine (FIXED - no int256) ─────────────
    function _increaseReputation(address _member, uint256 _amount) internal {
        members[_member].reputationScore += _amount;
        emit ReputationUpdated(_member, members[_member].reputationScore);
    }

    function _decreaseReputation(address _member, uint256 _amount) internal {
        if (_amount > members[_member].reputationScore) {
            members[_member].reputationScore = 0;
        } else {
            members[_member].reputationScore -= _amount;
        }
        emit ReputationUpdated(_member, members[_member].reputationScore);
    }

    // ─── Query Functions ───────────────────────────────────
    function getIoC(uint256 _id) public view returns (IoC memory) {
        return iocs[_id];
    }

    function checkIoC(string memory _value) public view returns (bool isMalicious, uint256 id) {
        uint256 foundId = iocValueToId[_value];
        if (foundId == 0) return (false, 0);
        return (iocs[foundId].isActive, foundId);
    }

    function getMemberCount() public view returns (uint256) {
        return memberList.length;
    }

    function getTotalIoCs() public view returns (uint256) {
        return iocCounter;
    }
}