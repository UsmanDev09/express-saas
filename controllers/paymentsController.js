const express = require('express');
const paymentService = require('../services/paymentService');
const checkoutSession = async(req,res)=>{
    try {
        if(req.body)
        {
            const product = req.body.products;
            const checkout = await paymentService.checkoutSession(product,res);
            res.status(200).json(checkout);
        }else{
            throw new Error("Body needed");
        }
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
module.exports={
    checkoutSession,
}