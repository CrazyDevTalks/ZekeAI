import { ThirdwebSDK } from "@thirdweb-dev/sdk";
// import names from "../utils/names";

export default async function server() {
    try {
        // De-structure the arguments we passed in out of the request body
        const { authorAddress, nftName, imagePath } = JSON.parse(req.body);

        // You'll need to add your private key in a .env.local file in the root of your project
        // !!!!! NOTE !!!!! NEVER LEAK YOUR PRIVATE KEY to anyone!
        if (!process.env.MINT_PRIVATE_KEY) {
            throw new Error("You're missing MINT_PRIVATE_KEY in your .env.local file.");
        }

        // Initialize the Thirdweb SDK on the serverside
        const sdk = ThirdwebSDK.fromPrivateKey(
            // Your wallet private key (read it in from .env.local file)
            process.env.MINT_PRIVATE_KEY,
            "goerli"
        );

        // Load the NFT Collection via it's contract address using the SDK
        const nftCollection = await sdk.getContract(
            // Replace this with your NFT Collection contract address
            process.env.MINT_COLLECTION_ADDRESS,
            'nft-collection'
        );

        // Here we can make all kinds of cool checks to see if the user is eligible to mint the NFT.
        // Here are a few examples:

        // 1) Check that it's a name from our list 
        // This demonstrates how we can restrict what kinds of NFTs we give signatures for
        // if (!names.includes(nftName?.toLowerCase())) {
        //     res.status(400).json({ error: "That's not one of the names we know!" });
        //     return;
        // }

        // 2) Check that this wallet hasn't already minted a page - 1 NFT per wallet
        // const hasMinted = (await nftCollection.balanceOf(authorAddress)).gt(0);
        // if (hasMinted) {
        //     res.status(400).json({ error: "Already minted" });
        //     return;
        // }

        // If all the checks pass, begin generating the signature...
        // Generate the signature for the page NFT
        const signedPayload = await nftCollection.signature.generate({
            to: authorAddress,
            metadata: {
                name: nftName,
                image: imagePath,
                description: "An awesome NFT",
                properties: {
                    // Add any properties you want to store on the NFT
                },
            },
        });

        // Return back the signedPayload to the client.
        res.status(200).json({
            signedPayload: JSON.parse(JSON.stringify(signedPayload)),
        });
    } catch (e) {
        res.status(500).json({ error: `Server error ${e}` });
    }
}