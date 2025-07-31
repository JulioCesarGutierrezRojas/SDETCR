const Simulator = require('../model/simulator.model');
const Category = require('../../categories/model/category.model');
const ApiResponse = require('../../../kernel/api.response')
const TypesResponse = require('../../../kernel/types.response');
const sequelize = require('../../../config/database');
const Answer = require('../../answers/model/answer.model');
const History = require('../../history/model/history.model');
const User = require('../../users/model/user.model');

const saveSimulatorResult = async ({ student_id, simulator_id, final_score, answers }) => {
    const transaction = await sequelize.transaction();
    try {
        const history = await History.create({
            student_id,
            simulator_id,
            final_score,
            date_realized: new Date()
        }, { transaction });

        const answerRecords = [];
        for (const ans of answers) {
            const { question_id, type_response, answer, url_video } = ans;
            if (!question_id || !type_response) {
                await transaction.rollback();
                return new ApiResponse(null, null, TypesResponse.WARNING, 'Faltan datos en una respuesta', 400);
            }

            const newAnswer = await Answer.create({
                student_id,
                question_id,
                type_response,
                answer: type_response === 'texto' ? answer : null,
                url_video: type_response === 'video' ? url_video : null,
                date_response: new Date()
            }, { transaction });

            answerRecords.push(newAnswer);
        }

        await transaction.commit();
        return new ApiResponse({
            history_id: history.history_id,
            answers_saved: answerRecords.length
        }, null, TypesResponse.SUCCESS, 'Historial y respuestas guardados con éxito', 201);
    } catch (error) {
        await transaction.rollback();
        console.error('Error en saveSimulatorResult service:', error);
        return new ApiResponse(null, null, TypesResponse.ERROR, 'Error interno del servidor', 500);
    }
}


const updateSimulator = async (id, data) => {
    try{
        const simulator = await Simulator.findByPk(id)

        if(!simulator){
            return new ApiResponse(null, null, TypesResponse.WARNING, 'Simulador No Encontrado', 404)
        }

        const {name, status, category_id } = data

        if(category_id != undefined){
            const categoriaExiste = await Category.findByPk(category_id)
            if(!categoriaExiste){
                return new ApiResponse(null, null, TypesResponse.WARNING, 'Categoria No Encontrada', 400)
            }
            simulator.category_id = category_id
        }

        if(name !== undefined) simulator.name = name
        if(status !== undefined) simulator.status = status

        await simulator.save()

        return new ApiResponse(null, null, TypesResponse.SUCCESS, 'Simulador actualizado exitosamente', 200)
    }catch(error){
        console.log('Error en el updateSimulator:', error.message)
        throw new Error(error.message || 'Error al actualizar el simulador')
    }
}

const createSimulator = async (name, category_id) => {
    try {
        if (!name || !category_id) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'Nombre y categoría son requeridos', 400)
        }

        const nuevo = await Simulator.create({
            name,
            category_id,
            status: true //lopuse ooir default pa que esdten habilitados
        })

        return new ApiResponse(null, null, TypesResponse.SUCCESS, 'Simulador creado exitosamente', 201)
    } catch (error) {
        console.log('Error en createSimulator:', error.message)
        throw new Error(error.message || 'Error al crear el simulador')
    }
}

const disableSimulator = async (simulatorId) => {
    try {
        const simulador = await Simulator.findByPk(simulatorId)

        if (!simulador) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'Simulador no encontrado', 404)
        }

        simulador.status = false
        await simulador.save()

        return new ApiResponse(null, null, TypesResponse.SUCCESS, 'Simulador deshabilitado correctamente', 200)
    } catch (error) {
        console.log('Error en disableSimulator:', error.message)
        throw new Error(error.message || 'Error al deshabilitar el simulador')
    }
}

const getAllSimulators = async () => {
    try {
        const simuladors = await Simulator.findAll()
        return new ApiResponse(null, simuladors, TypesResponse.SUCCESS, 'Simuladores obtenidos exitosamente', 200)
    } catch (error) {
        console.log('Error al obtener todos los simuladores:', error.message)
        throw new Error(error.message || 'Error al obtener los simuladores')
    }
}

const getSimulatorsByCategory = async (category_id) => {
    try {
        if (!category_id) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'El ID de la categoría es requerido', 400);
        }

        // Verificar que la categoría existe y está activa
        const Category = require('../../categories/model/category.model');
        const category = await Category.findOne({
            where: {
                category_id: category_id,
                status: true
            },
            attributes: ['category_id', 'name', 'description']
        });

        if (!category) {
            return new ApiResponse(null, null, TypesResponse.WARNING, 'Categoría no encontrada o inactiva', 404);
        }

        // Obtener todos los simuladores de la categoría
        const simulators = await Simulator.findAll({
            where: {
                category_id: category_id,
                status: true
            },
            attributes: ['simulator_id', 'name', 'status']
        });

        // Formatear la respuesta
        const formattedSimulators = simulators.map(simulator => ({
            simulator_id: simulator.simulator_id,
            simulator_name: simulator.name,
            status: simulator.status
        }));

        const result = {
            category: {
                category_id: category.category_id,
                category_name: category.name,
                category_description: category.description
            },
            simulators: formattedSimulators,
            simulators_count: formattedSimulators.length
        };

        return new ApiResponse(null, result, TypesResponse.SUCCESS, 'Simuladores de la categoría obtenidos exitosamente', 200);

    } catch (error) {
        console.error('Error en getSimulatorsByCategory:', error);
        return new ApiResponse(null, null, TypesResponse.ERROR, 'Error interno al obtener los simuladores de la categoría', 500);
    }
};

module.exports = {
    updateSimulator,
    createSimulator,
    disableSimulator,
    getAllSimulators,
    saveSimulatorResult,
    getSimulatorsByCategory
}
