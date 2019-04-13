import { crypto } from "../../../crypto";
import { TransactionTypes } from "../../../enums";
import { ITransactionAsset, ITransactionData } from "../../../interfaces";
import { feeManager } from "../../../managers";
import { Bignum } from "../../../utils";
import { TransactionBuilder } from "./transaction";

export class SecondSignatureBuilder extends TransactionBuilder<SecondSignatureBuilder> {
    constructor() {
        super();

        this.data.type = TransactionTypes.SecondSignature;
        this.data.fee = feeManager.get(TransactionTypes.SecondSignature);
        this.data.amount = Bignum.ZERO;
        this.data.recipientId = null;
        this.data.senderPublicKey = null;
        this.data.asset = { signature: {} } as ITransactionAsset;
    }

    /**
     * Establish the signature on the asset, which is the one that would be that
     * would be register on the blockchain, when creating a second passphrase.
     */
    public signatureAsset(secondPassphrase: string): SecondSignatureBuilder {
        this.data.asset.signature.publicKey = crypto.getKeys(secondPassphrase).publicKey;
        return this;
    }

    /**
     * Overrides the inherited method to return the additional required by this.
     */
    public getStruct(): ITransactionData {
        const struct = super.getStruct();
        struct.amount = this.data.amount;
        struct.recipientId = this.data.recipientId;
        struct.asset = this.data.asset;
        return struct;
    }

    protected instance(): SecondSignatureBuilder {
        return this;
    }
}