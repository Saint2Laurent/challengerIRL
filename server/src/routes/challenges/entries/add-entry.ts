import { Request, Response, Application } from 'express';
import {Challenge} from "../../../entity/Challenge";
import {ChallengeEntry} from "../../../entity/ChallengeEntry";
import {calculateEloForNewEntry} from "../../../logic/challenge-logic";
import {getChallenge} from "../../../logic/challenge-general";



export const addEntry =  (app: Application ) => {

    app.post( "/challenges", async ( req: Request, res: Response ) => {
        console.log(req.body)

        const challenge = await Challenge.findOne({id: req.body.challengeId})

        const elo = await calculateEloForNewEntry(challenge, req.body.value);

        console.log(elo)

        ChallengeEntry.create({
            challenge: req.body.challengeId,
            value: +req.body.value,
            date: req.body.date,
            eloGain: elo
        })
            .save()
            .then( async (e)=>{
                if(e){
                    const challenge = await getChallenge(req.body.challengeId, true)
                    return res.json({
                        success: true,
                        challenge
                    })
                }
                return res.status(403)
            })
            .catch(e=>{
                console.log(e)
            })
            .finally(()=>{
                return res.status(500)
            })
    });
}