// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

interface IFunctionsConsumer {
        function sendRequest(
        string memory source,
        bytes memory encryptedSecretsUrls,
        uint8 donHostedSecretsSlotID,
        uint64 donHostedSecretsVersion,
        string[] memory args,
        bytes[] memory bytesArgs,
        uint64 subscriptionId,
        uint32 gasLimit,
        bytes32 jobId
    ) external returns (bytes32 requestId);
}
